import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Button, CancelarButton} from '@/components/Buttons.jsx';
import {buildPaginationItems} from './ordenesDeCompraAgregarUtils.jsx';

const pageButtonClass = 'mt-0! min-w-[2rem] px-2! py-1.5! text-xs!';
const activePageButtonClass = pageButtonClass + ' font-bold! bg-slate-200! dark:bg-slate-700!';

export const ArticulosAOrdenarPaginacion = ({
    meta,
    isLoading = false,
    onPageChange,
    onGenerar,
    generarCount = 0,
}) => {
    const currentPage = meta?.currentPage ?? 1;
    const lastPage = meta?.lastPage ?? 1;
    const total = meta?.total ?? 0;
    const paginationItems = buildPaginationItems(currentPage, lastPage);

    return (
        <ErrorBoundary>
            <div
                className={
                    'shrink-0 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm '
                    + 'dark:border-slate-700 dark:bg-transparent'
                }
            >
                <div className={'flex flex-wrap items-center justify-between gap-3'}>
                    <div className={'flex flex-wrap items-center gap-2'}>
                        {lastPage > 0 ? (
                            <div className={'flex flex-wrap items-center gap-1'}>
                                <CancelarButton
                                    format={'xs'}
                                    className={pageButtonClass}
                                    disabled={isLoading || currentPage <= 1}
                                    onClick={() => onPageChange(currentPage - 1)}
                                >
                                    {'<<'}
                                </CancelarButton>

                                {paginationItems.map((item) => (
                                    item.type === 'ellipsis' ? (
                                        <span
                                            key={item.key}
                                            className={'px-1 text-xs text-slate-500 dark:text-slate-400'}
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <CancelarButton
                                            key={item.key}
                                            format={'xs'}
                                            className={
                                                item.value === currentPage
                                                    ? activePageButtonClass
                                                    : pageButtonClass
                                            }
                                            disabled={isLoading || item.value === currentPage}
                                            onClick={() => onPageChange(item.value)}
                                        >
                                            {item.value}
                                        </CancelarButton>
                                    )
                                ))}

                                <CancelarButton
                                    format={'xs'}
                                    className={pageButtonClass}
                                    disabled={isLoading || currentPage >= lastPage}
                                    onClick={() => onPageChange(currentPage + 1)}
                                >
                                    {'>>'}
                                </CancelarButton>
                            </div>
                        ) : null}
                    </div>

                    <p className={'text-xs text-slate-500 dark:text-slate-200!'}>
                        {total > 0
                            ? `${meta.from}–${meta.to} de ${total} artículos`
                            : 'Sin artículos'}
                    </p>

                    <Button
                        onClick={onGenerar}
                        disabled={isLoading || generarCount === 0}
                        className={'mt-0! px-4! py-1.5! text-xs!'}
                    >
                        Continuar ({generarCount})
                    </Button>
                </div>
            </div>
        </ErrorBoundary>
    );
};
