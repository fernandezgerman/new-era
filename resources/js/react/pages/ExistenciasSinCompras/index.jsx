import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {PageHeader, RefreshIconButton} from '@/components/H.jsx';
import {Button, CancelarButton} from '@/components/Buttons.jsx';
import {Input} from '@/components/Input.jsx';
import {LabelError} from '@/components/Label.jsx';
import {SelectArticulo} from '@/components/selects/SelectArticulo.jsx';
import {SelectRubro} from '@/components/selects/SelectRubro.jsx';
import {SelectSucursal} from '@/components/selects/SelectSucursales.jsx';
import {AlternativeCard} from '@/components/Card.jsx';
import {ContainerWithFooter} from '@/components/Containers/ContainerWithFooter.jsx';
import {useExistenciasSinCompras} from '@/dataHooks/useExistenciasSinCompras.jsx';
import {ExistenciasSinComprasLista} from './ExistenciasSinComprasLista.jsx';
import {
    EXISTENCIAS_SIN_COMPRAS_DEFAULT_DIAS,
    buildExistenciasSinComprasFilters,
    getPaginationMeta,
} from './existenciasSinComprasUtils.jsx';

export const ExistenciasSinCompras = () => {
    const [diasUltimaCompra, setDiasUltimaCompra] = useState(EXISTENCIAS_SIN_COMPRAS_DEFAULT_DIAS);
    const [sucursal, setSucursal] = useState(null);
    const [articulo, setArticulo] = useState(null);
    const [rubro, setRubro] = useState(null);
    const [page, setPage] = useState(1);
    const [submittedFilters, setSubmittedFilters] = useState(null);
    const hasSearched = submittedFilters != null;

    const reporteQuery = useExistenciasSinCompras({
        filters: submittedFilters,
        page,
        enabled: !!submittedFilters,
    });

    const items = reporteQuery.data?.data ?? [];
    const paginationMeta = useMemo(
        () => getPaginationMeta(reporteQuery.data),
        [reporteQuery.data],
    );

    useEffect(() => {
        setPage(1);
    }, [submittedFilters]);

    const onBuscar = useCallback(() => {
        setSubmittedFilters(
            buildExistenciasSinComprasFilters({
                diasUltimaCompra,
                sucursal,
                articulo,
                rubro,
            }),
        );
    }, [diasUltimaCompra, sucursal, articulo, rubro]);

    const isLoading = reporteQuery.isFetching;
    const diasInvalidos = !Number.isFinite(diasUltimaCompra) || diasUltimaCompra < 1;

    const footer = (
        <>
            <p className={'text-xs text-slate-500 dark:text-slate-400'}>
                {!hasSearched
                    ? 'Presione Buscar para cargar los resultados.'
                    : paginationMeta.total > 0
                        ? `Mostrando ${paginationMeta.from}–${paginationMeta.to} de ${paginationMeta.total} registros`
                        : 'Sin registros'}
                {hasSearched ? (
                    <>
                        {' '}
                        (página {paginationMeta.currentPage} de {paginationMeta.lastPage})
                    </>
                ) : null}
            </p>
            <div className={'flex items-center gap-2'}>
                <CancelarButton
                    format={'xs'}
                    className={'mt-0! px-3! py-1.5! text-xs!'}
                    disabled={!hasSearched || isLoading || paginationMeta.currentPage <= 1}
                    onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                >
                    Anterior
                </CancelarButton>
                <CancelarButton
                    format={'xs'}
                    className={'mt-0! px-3! py-1.5! text-xs!'}
                    disabled={!hasSearched || isLoading || paginationMeta.currentPage >= paginationMeta.lastPage}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                >
                    Siguiente
                </CancelarButton>
            </div>
        </>
    );

    return (
        <ErrorBoundary>
            <PageHeader>Existencias sin compras</PageHeader>

            <AlternativeCard>
                <div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'}>
                    <div>
                        <Input
                            type={'number'}
                            value={diasUltimaCompra ?? ''}
                            setValue={(val) => setDiasUltimaCompra(
                                Number.isFinite(val) ? parseInt(val, 10) : null,
                            )}
                            label={'Días desde la última compra'}
                            placeHolder={'Ej: 365'}
                            className={'mt-0'}
                            maxCharacters={4}
                            errorMessage={diasInvalidos ? 'Ingrese al menos 1 día.' : null}
                        />
                    </div>
                    <div>
                        <SelectSucursal
                            sucursal={sucursal}
                            setSucursal={setSucursal}
                            label={'Sucursal'}
                            placeHolder={'Todas las sucursales'}
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

                {reporteQuery.isError ? (
                    <div className={'mt-4'}>
                        <LabelError>
                            {reporteQuery.error?.message ?? 'Error al cargar el reporte.'}
                        </LabelError>
                    </div>
                ) : null}

                <div className={'mt-4 flex justify-end'}>
                    <Button
                        onClick={onBuscar}
                        disabled={isLoading || diasInvalidos}
                        className={'w-full md:w-auto'}
                    >
                        Buscar
                    </Button>
                </div>
            </AlternativeCard>

            <ContainerWithFooter footer={footer} scrolleableClassName={'max-h-[calc(100vh-38rem)] '}>
                <div className={'mb-4 flex flex-wrap items-center justify-end gap-2 border-b border-slate-200 pb-2 dark:border-slate-700'}>
                    {hasSearched ? (
                        <RefreshIconButton
                            onRefresh={reporteQuery.refetch}
                            loading={isLoading}
                            className={'p-1! px-1.5!'}
                        />
                    ) : null}
                </div>

                <ExistenciasSinComprasLista
                    items={items}
                    isLoading={isLoading && hasSearched}
                    hasSearched={hasSearched}
                />
            </ContainerWithFooter>
        </ErrorBoundary>
    );
};
