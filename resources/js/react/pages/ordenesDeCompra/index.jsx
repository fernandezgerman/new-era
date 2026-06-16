import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {AddIconButton, PageHeader, RefreshIconButton} from '@/components/H.jsx';
import {Button, CancelarButton} from '@/components/Buttons.jsx';
import {DatePicker} from '@/components/DatePicker.jsx';
import {Label, LabelError} from '@/components/Label.jsx';
import {SelectProveedor} from '@/components/selects/SelectProveedor.jsx';
import {SelectSucursal} from '@/components/selects/SelectSucursales.jsx';
import {SelectUsuario} from '@/components/selects/SelectUsuario.jsx';
import {SelectArticulo} from '@/components/selects/SelectArticulo.jsx';
import {SelectRubro} from '@/components/selects/SelectRubro.jsx';
import {useOrdenesDeCompra} from '@/dataHooks/useOrdenesDeCompra.jsx';
import {useArticulosSelect} from '@/dataHooks/useArticulosSelect.jsx';
import {OrdenesDeCompraLista} from './OrdenesDeCompraLista.jsx';
import {
    ORDENES_DE_COMPRA_DEFAULT_SORT,
    ORDENES_DE_COMPRA_DEFAULT_SORT_DIRECTION,
    ORDENES_DE_COMPRA_SORT_DIRECTION_OPTIONS,
    ORDENES_DE_COMPRA_SORT_OPTIONS,
    buildOrdenesDeCompraFilters,
    getPaginationMeta,
    todayDate,
} from './ordenesDeCompraUtils.jsx';
import {AlternativeCard} from '@/components/Card.jsx';
import {AgregarOrdenDecompra} from '@/pages/ordenesDeCompraAgregar/index.jsx';

const selectFieldClass =
    'mt-1 block w-full min-w-[10rem] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm '
    + 'text-slate-900 dark:ne-dark-body! dark:bg-slate-900 dark:text-slate-100';

export const OrdenesDeCompraReporte = () => {
    const [proveedores, setProveedores] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [fechaDesde, setFechaDesde] = useState(todayDate);
    const [fechaHasta, setFechaHasta] = useState(todayDate);
    const [articulo, setArticulo] = useState(null);
    const [rubro, setRubro] = useState(null);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState(ORDENES_DE_COMPRA_DEFAULT_SORT);
    const [sortDirection, setSortDirection] = useState(ORDENES_DE_COMPRA_DEFAULT_SORT_DIRECTION);
    const [showAgregar, setShowAgregar] = useState(false);
    const [submittedFilters, setSubmittedFilters] = useState(() =>
        buildOrdenesDeCompraFilters({
            fechaDesde: todayDate(),
            fechaHasta: todayDate(),
        }),
    );

    const {data: articulosCatalog = []} = useArticulosSelect();

    const ordenesQuery = useOrdenesDeCompra({
        filters: submittedFilters,
        page,
        sort,
        sortDirection,
        enabled: !!submittedFilters,
    });

    const ordenes = ordenesQuery.data?.data ?? [];
    const paginationMeta = useMemo(
        () => getPaginationMeta(ordenesQuery.data),
        [ordenesQuery.data],
    );

    useEffect(() => {
        setPage(1);
    }, [submittedFilters, sort, sortDirection]);

    const onBuscar = useCallback(() => {
        setSubmittedFilters(
            buildOrdenesDeCompraFilters({
                proveedores,
                sucursales,
                usuarios,
                fechaDesde,
                fechaHasta,
                articulo,
                rubro,
            }),
        );
    }, [proveedores, sucursales, usuarios, fechaDesde, fechaHasta, articulo, rubro]);

    const handleBackFromAgregar = useCallback(() => {
        setShowAgregar(false);
    }, []);

    const handleBackToReportWithToday = useCallback(async () => {
        const today = todayDate();

        setProveedores([]);
        setSucursales([]);
        setUsuarios([]);
        setFechaDesde(today);
        setFechaHasta(today);
        setArticulo(null);
        setRubro(null);
        setPage(1);
        setSubmittedFilters(
            buildOrdenesDeCompraFilters({
                fechaDesde: today,
                fechaHasta: today,
            }),
        );
        setShowAgregar(false);
        await ordenesQuery.refetch();
    }, [ordenesQuery]);

    const isLoading = ordenesQuery.isFetching;

    if (showAgregar) {
        return (
            <ErrorBoundary>
                <AgregarOrdenDecompra
                    onBack={handleBackFromAgregar}
                    onBackToReport={handleBackToReportWithToday}
                />
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary>
            <PageHeader>Ordenes de compra</PageHeader>
            <AlternativeCard>
                <div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'}>
                    <div>
                        <SelectProveedor
                            multiple
                            proveedor={proveedores}
                            setProveedor={setProveedores}
                            label={'Proveedores'}
                            placeHolder={'Seleccione proveedores'}
                        />
                    </div>
                    <div>
                        <SelectSucursal
                            multiple
                            sucursal={sucursales}
                            setSucursal={setSucursales}
                            label={'Sucursales'}
                            placeHolder={'Seleccione sucursales'}
                        />
                    </div>
                    <div>
                        <SelectUsuario
                            multiple
                            usuario={usuarios}
                            setUsuario={setUsuarios}
                            label={'Usuarios'}
                            placeHolder={'Seleccione usuarios'}
                        />
                    </div>
                    <div>
                        <DatePicker
                            value={fechaDesde}
                            setValue={setFechaDesde}
                            label={'Fecha desde'}
                            placeHolder={'Seleccione fecha desde'}
                            className={'mt-2'}
                        />
                    </div>
                    <div>
                        <DatePicker
                            value={fechaHasta}
                            setValue={setFechaHasta}
                            label={'Fecha hasta'}
                            placeHolder={'Seleccione fecha hasta'}
                            className={'mt-2'}
                        />
                    </div>
                    <div>
                        <SelectArticulo
                            articulo={articulo}
                            setArticulo={setArticulo}
                        />
                    </div>
                    <div>
                        <SelectRubro
                            rubro={rubro}
                            setRubro={setRubro}
                        />
                    </div>
                </div>

                {ordenesQuery.isError ? (
                    <div className={'mt-4'}>
                        <LabelError>
                            {ordenesQuery.error?.message ?? 'Error al cargar las órdenes de compra.'}
                        </LabelError>
                    </div>
                ) : null}

                <div className={'mt-4 flex justify-end'}>
                    <Button
                        onClick={onBuscar}
                        disabled={isLoading}
                        className={'w-full md:w-auto'}
                    >
                        Buscar
                    </Button>
                </div>
            </AlternativeCard>

            <br/>

            <AlternativeCard>
                <div className={'mb-4 flex flex-wrap items-end gap-4'}>
                    <div
                        className={'flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-700 w-full p-2 pl-6 '}>
                        {paginationMeta.total > 0 && (
                            <>
                                <div><Label className={'pl-0'}>Orden:</Label></div>
                                <div>
                                    <select
                                        className={selectFieldClass}
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                    >
                                        {ORDENES_DE_COMPRA_SORT_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        className={selectFieldClass}
                                        value={sortDirection}
                                        onChange={(e) => setSortDirection(e.target.value)}
                                    >
                                        {ORDENES_DE_COMPRA_SORT_DIRECTION_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        <div className={'float-right w-full '}>
                            <AddIconButton onAdd={() => setShowAgregar(true)} className={'  p-1! px-1.5! '}/>
                            <RefreshIconButton onRefresh={ordenesQuery?.refetch} className={'  p-1! px-1.5! '}/>
                        </div>
                    </div>

                </div>

                <OrdenesDeCompraLista
                    ordenes={ordenes}
                    articulosCatalog={articulosCatalog}
                    isLoading={isLoading}
                    onRefresh={ordenesQuery.refetch}
                />

                <div className={'mt-4 flex flex-wrap items-center justify-between gap-3'}>
                    <p className={'text-xs text-slate-500 dark:text-slate-400'}>
                        {paginationMeta.total > 0
                            ? `Mostrando ${paginationMeta.from}–${paginationMeta.to} de ${paginationMeta.total} registros`
                            : 'Sin registros'}
                        {' '}
                        (pagina {paginationMeta.currentPage} de {paginationMeta.lastPage})
                    </p>
                    <div className={'flex items-center gap-2'}>
                        <CancelarButton
                            format={'xs'}
                            className={'mt-0! px-3! py-1.5! text-xs!'}
                            disabled={isLoading || paginationMeta.currentPage <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Anterior
                        </CancelarButton>
                        <CancelarButton
                            format={'xs'}
                            className={'mt-0! px-3! py-1.5! text-xs!'}
                            disabled={isLoading || paginationMeta.currentPage >= paginationMeta.lastPage}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Siguiente
                        </CancelarButton>
                    </div>
                </div>
            </AlternativeCard>
        </ErrorBoundary>
    );
};
