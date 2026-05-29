import React, {useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Table} from '@/components/Table.jsx';
import {Button, CancelarButton} from '@/components/Buttons.jsx';
import ProveedoresImportarListasResource from '@/resources/ProveedoresImportarListas.jsx';
import {
    LISTA_DETALLE_TABLE_HEADER,
    buildListaDetalleTableData,
    getDetallesPaginationMeta,
    getDetallesRows,
} from './importarListasUtils.jsx';

const proveedoresImportarListasResource = new ProveedoresImportarListasResource();

const cardShellClass =
    'p-4 rounded-lg border border-slate-200/80 bg-white text-slate-900 shadow ' +
    'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]';

export const ImportarListasPasoColumnasDefinidas = ({importacion, onNuevaLista}) => {
    const idlista = importacion?.lista?.id;
    const initialDetallesPaginated = importacion?.detalles;
    const initialPage = initialDetallesPaginated?.current_page ?? 1;

    const [page, setPage] = useState(initialPage);

    const detallesQuery = useQuery({
        queryKey: ['importacion-listas-lista-detalles', idlista, page],
        queryFn: () => proveedoresImportarListasResource.getDetallesLista(idlista, page),
        enabled: !!idlista && page !== initialPage,
    });

    const detallesPaginated =
        page === initialPage && initialDetallesPaginated
            ? initialDetallesPaginated
            : detallesQuery.data;

    const paginationMeta = useMemo(
        () => getDetallesPaginationMeta(detallesPaginated),
        [detallesPaginated],
    );

    const tableData = useMemo(
        () => buildListaDetalleTableData(getDetallesRows(detallesPaginated)),
        [detallesPaginated],
    );

    const isLoadingDetalles = detallesQuery.isFetching && page !== initialPage;

    return (
        <div className={cardShellClass}>
            <p className={'text-base font-medium text-green-700 dark:text-green-400'}>
                Los datos de listas de proveedores han sido importados correctamente.
            </p>
            <p className={'mt-2 mb-4 text-sm text-slate-600 dark:text-slate-400'}>
                Ya puede consultar la lista de precios
            </p>

            <Table
                header={LISTA_DETALLE_TABLE_HEADER}
                data={tableData}
                isLoading={isLoadingDetalles}
                emptyText={'Sin registros en la lista importada.'}
                containerClassName={'overflow-x-auto'}
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
                        disabled={isLoadingDetalles || paginationMeta.currentPage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Anterior
                    </CancelarButton>
                    <CancelarButton
                        format={'xs'}
                        className={'mt-0! px-3! py-1.5! text-xs!'}
                        disabled={
                            isLoadingDetalles
                            || paginationMeta.currentPage >= paginationMeta.lastPage
                        }
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Siguiente
                    </CancelarButton>
                </div>
            </div>

            <div className={'mt-6'}>
                <Button onClick={onNuevaLista} className={'w-full md:w-auto'}>
                    Agregar nueva lista
                </Button>
            </div>
        </div>
    );
};
