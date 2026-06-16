import React, {useCallback, useMemo, useRef, useState} from 'react';
import {PageHeader} from '@/components/H.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {AlternativeCard} from '@/components/Card.jsx';
import {Button} from '@/components/Buttons.jsx';
import {LabelError} from '@/components/Label.jsx';
import {Loading} from '@/components/Loading.jsx';
import {ValidationError} from '@/exceptions/Exceptions.jsx';
import OrdenesDeCompraResource from '@/resources/OrdenesDeCompra.jsx';
import {ArticulosAOrdenarFiltros} from './ArticulosAOrdenarFiltros.jsx';
import {ArticulosAOrdenarFiltrosResumen} from './ArticulosAOrdenarFiltrosResumen.jsx';
import {ArticulosAOrdenarTabla} from './ArticulosAOrdenarTabla.jsx';
import {ArticulosAOrdenarGenerar} from './ArticulosAOrdenarGenerar.jsx';
import {ArticulosAOrdenarPaginacion} from './ArticulosAOrdenarPaginacion.jsx';
import {
    AGREGAR_ORDEN_STEPS,
    ARTICULOS_A_ORDENAR_DEFAULT_PAGE,
    ARTICULOS_A_ORDENAR_DEFAULT_PER_PAGE,
    ARTICULOS_A_ORDENAR_DEFAULT_SOLO_STOCK_ACTIVO,
    ARTICULOS_A_ORDENAR_DEFAULT_SOLO_VENDIDOS,
    buildArticulosAOrdenarFilters,
    buildArticulosAOrdenarParams,
    countPersistedArticulosConCantidad,
    getArticulosAOrdenarPaginationMeta,
    getPersistedArticulosConCantidad,
    validateArticulosAOrdenarFilters,
} from './ordenesDeCompraAgregarUtils.jsx';

const resource = new OrdenesDeCompraResource();

export const AgregarOrdenDecompra = ({onBack, onBackToReport}) => {
    const tableScrollRef = useRef(null);
    const [rubros, setRubros] = useState([]);
    const [sucursal, setSucursal] = useState(null);
    const [diasventas, setDiasventas] = useState(7);
    const [marcas, setMarcas] = useState([]);
    const [soloStockActivo, setSoloStockActivo] = useState(ARTICULOS_A_ORDENAR_DEFAULT_SOLO_STOCK_ACTIVO);
    const [soloVendidos, setSoloVendidos] = useState(ARTICULOS_A_ORDENAR_DEFAULT_SOLO_VENDIDOS);
    const [fieldErrors, setFieldErrors] = useState({});
    const [submittedFilters, setSubmittedFilters] = useState(null);
    const [filtersLocked, setFiltersLocked] = useState(false);
    const [articulosData, setArticulosData] = useState(null);
    const [currentPage, setCurrentPage] = useState(ARTICULOS_A_ORDENAR_DEFAULT_PAGE);
    const [isLoading, setIsLoading] = useState(false);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [persistedRowEdits, setPersistedRowEdits] = useState({});
    const [focusFirstCantidadOnLoad, setFocusFirstCantidadOnLoad] = useState(false);
    const [step, setStep] = useState(AGREGAR_ORDEN_STEPS.CARGAR);
    const [saveCompleted, setSaveCompleted] = useState(false);

    const onSaveStateChange = useCallback(({saveStarted, saveCompleted: completed}) => {
        setSaveCompleted(Boolean(saveStarted && completed));
    }, []);

    const paginationMeta = useMemo(
        () => getArticulosAOrdenarPaginationMeta(articulosData),
        [articulosData],
    );

    const generarItems = useMemo(
        () => getPersistedArticulosConCantidad(persistedRowEdits),
        [persistedRowEdits],
    );

    const generarCount = useMemo(
        () => countPersistedArticulosConCantidad(persistedRowEdits),
        [persistedRowEdits],
    );

    const fetchArticulos = useCallback(async (filters, page = ARTICULOS_A_ORDENAR_DEFAULT_PAGE) => {
        const params = buildArticulosAOrdenarParams(filters, {
            page,
            perPage: ARTICULOS_A_ORDENAR_DEFAULT_PER_PAGE,
        });

        const data = await resource.getArticulosAOrdenar(params);
        setArticulosData(data);
        setCurrentPage(page);
        return data;
    }, []);

    const onCargarArticulos = useCallback(async () => {
        const errors = validateArticulosAOrdenarFilters({
            rubros,
            sucursal,
            diasventas,
        });

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        const filters = buildArticulosAOrdenarFilters({
            rubros,
            sucursal,
            diasventas,
            marcas,
            soloStockActivo,
            soloVendidos,
        });

        setFieldErrors({});
        setApiError(null);
        setFiltersLocked(false);
        setSubmittedFilters(filters);
        setArticulosData(null);
        setCurrentPage(ARTICULOS_A_ORDENAR_DEFAULT_PAGE);
        setPersistedRowEdits({});
        setStep(AGREGAR_ORDEN_STEPS.CARGAR);
        setIsLoading(true);

        try {
            await fetchArticulos(filters, ARTICULOS_A_ORDENAR_DEFAULT_PAGE);
            setFiltersLocked(true);
        } catch (err) {
            setApiError(
                err instanceof ValidationError
                    ? err.message
                    : (err?.message ?? 'Error al cargar los artículos.'),
            );
        } finally {
            setIsLoading(false);
        }
    }, [rubros, sucursal, diasventas, marcas, soloStockActivo, soloVendidos, fetchArticulos]);

    const onPageChange = useCallback(async (page) => {
        if (!submittedFilters || page < 1 || page === currentPage) {
            return;
        }

        setApiError(null);
        setIsTableLoading(true);

        let pageLoaded = false;

        try {
            await fetchArticulos(submittedFilters, page);
            tableScrollRef.current?.scrollTo({top: 0, behavior: 'smooth'});
            pageLoaded = true;
        } catch (err) {
            setApiError(
                err instanceof ValidationError
                    ? err.message
                    : (err?.message ?? 'Error al cargar los artículos.'),
            );
        } finally {
            setIsTableLoading(false);
            setFocusFirstCantidadOnLoad(pageLoaded);
        }
    }, [submittedFilters, currentPage, fetchArticulos]);

    const onGoToNextPage = useCallback(() => {
        if (paginationMeta.currentPage >= paginationMeta.lastPage || isTableLoading) {
            return;
        }
        onPageChange(paginationMeta.currentPage + 1);
    }, [paginationMeta, isTableLoading, onPageChange]);

    const onFocusFirstCantidadHandled = useCallback(() => {
        setFocusFirstCantidadOnLoad(false);
    }, []);

    const onPersistRowEdit = useCallback((articuloId, rowEdit, item) => {
        setPersistedRowEdits((prev) => ({
            ...prev,
            [articuloId]: {
                ...rowEdit,
                item,
            },
        }));
    }, []);

    const onClearPersistedRowEdit = useCallback((articuloId) => {
        setPersistedRowEdits((prev) => {
            if (!(articuloId in prev)) {
                return prev;
            }
            const next = {...prev};
            delete next[articuloId];
            return next;
        });
    }, []);

    const onGenerar = useCallback(() => {
        if (generarCount === 0) {
            return;
        }
        setStep(AGREGAR_ORDEN_STEPS.GENERAR);
    }, [generarCount]);

    const onVolverACargar = useCallback(() => {
        setStep(AGREGAR_ORDEN_STEPS.CARGAR);
    }, []);

    const onVolverAFiltros = useCallback(() => {
        setFiltersLocked(false);
        setArticulosData(null);
        setApiError(null);
        setPersistedRowEdits({});
        setStep(AGREGAR_ORDEN_STEPS.CARGAR);
        setCurrentPage(ARTICULOS_A_ORDENAR_DEFAULT_PAGE);
    }, []);

    const handleHeaderBack = useCallback(() => {
        if (saveCompleted) {
            onBackToReport?.();
            return;
        }

        if (step === AGREGAR_ORDEN_STEPS.GENERAR) {
            onVolverACargar();
            return;
        }

        if (filtersLocked) {
            onVolverAFiltros();
            return;
        }

        onBack?.();
    }, [
        saveCompleted,
        step,
        filtersLocked,
        onBack,
        onBackToReport,
        onVolverACargar,
        onVolverAFiltros,
    ]);

    const showTable = filtersLocked
        && step === AGREGAR_ORDEN_STEPS.CARGAR
        && (articulosData || isTableLoading);

    return (
        <ErrorBoundary>
            <PageHeader onBack={handleHeaderBack}>
                {step === AGREGAR_ORDEN_STEPS.GENERAR
                    ? 'Generar orden de compra'
                    : 'Agregar ordene de compra'}
            </PageHeader>

            <AlternativeCard className={'relative'}>
                {filtersLocked ? (
                    <ArticulosAOrdenarFiltrosResumen filters={submittedFilters} />
                ) : (
                    <ArticulosAOrdenarFiltros
                        rubros={rubros}
                        setRubros={setRubros}
                        sucursal={sucursal}
                        setSucursal={setSucursal}
                        diasventas={diasventas}
                        setDiasventas={setDiasventas}
                        marcas={marcas}
                        setMarcas={setMarcas}
                        soloStockActivo={soloStockActivo}
                        setSoloStockActivo={setSoloStockActivo}
                        soloVendidos={soloVendidos}
                        setSoloVendidos={setSoloVendidos}
                        fieldErrors={fieldErrors}
                        disabled={isLoading}
                    />
                )}

                {isLoading ? (
                    <div className={'mt-4 flex justify-center py-6'}>
                        <Loading />
                    </div>
                ) : null}

                {apiError && !showTable ? (
                    <div className={'mt-4'}>
                        <LabelError>{apiError}</LabelError>
                    </div>
                ) : null}

                {!filtersLocked ? (
                    <div className={'mt-4 flex justify-end'}>
                        <Button
                            onClick={onCargarArticulos}
                            disabled={isLoading}
                            className={'w-full md:w-auto'}
                        >
                            Cargar Articulos
                        </Button>
                    </div>
                ) : null}
            </AlternativeCard>

            {showTable ? (
                <>
                    <br/>
                    <AlternativeCard className={'overflow-hidden p-0! mt-0!'}>
                        <div className={'flex max-h-[calc(100vh-14rem)] min-h-[20rem] flex-col'}>
                            <div
                                ref={tableScrollRef}
                                className={'relative flex-1 overflow-y-auto p-4 max-h-[calc(100vh-25rem)]' + (isTableLoading ? ' opacity-50 ' : '')}
                            >
                                {isTableLoading && !articulosData ? (
                                    <div className={'flex justify-center py-12'}>
                                        <Loading />
                                    </div>
                                ) : (
                                    <ArticulosAOrdenarTabla
                                        articulos={articulosData?.articulos ?? []}
                                        sucursalId={submittedFilters?.sucursal?.id}
                                        persistedRowEdits={persistedRowEdits}
                                        onPersistRowEdit={onPersistRowEdit}
                                        onClearPersistedRowEdit={onClearPersistedRowEdit}
                                        scrollContainerRef={tableScrollRef}
                                        onGoToNextPage={onGoToNextPage}
                                        focusFirstCantidadOnLoad={focusFirstCantidadOnLoad}
                                        onFocusFirstCantidadHandled={onFocusFirstCantidadHandled}
                                        isTableLoading={isTableLoading}
                                    />
                                )}

                                {isTableLoading ? (
                                    <div className={'pointer-events-none absolute inset-0 flex items-center justify-center'}>
                                        <Loading />
                                    </div>
                                ) : null}
                            </div>

                            {apiError ? (
                                <div className={'border-t border-slate-200 px-4 py-2 dark:border-slate-700'}>
                                    <LabelError>{apiError}</LabelError>
                                </div>
                            ) : null}

                            {articulosData ? (
                                <ArticulosAOrdenarPaginacion
                                    meta={paginationMeta}
                                    isLoading={isTableLoading}
                                    onPageChange={onPageChange}
                                    onGenerar={onGenerar}
                                    generarCount={generarCount}
                                />
                            ) : null}
                        </div>
                    </AlternativeCard>
                </>
            ) : null}

            {step === AGREGAR_ORDEN_STEPS.GENERAR ? (
                <>
                    <br/>
                    <ArticulosAOrdenarGenerar
                        items={generarItems}
                        sucursalId={submittedFilters?.sucursal?.id}
                        onSaveStateChange={onSaveStateChange}
                    />
                </>
            ) : null}
        </ErrorBoundary>
    );
};
