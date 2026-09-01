import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Input} from '@/components/Input.jsx';
import {Checkbox} from '@/components/Checkbox.jsx';
import {LabelError} from '@/components/Label.jsx';
import {Button, CancelarButton} from '@/components/Buttons.jsx';
import {SelectRubro} from '@/components/selects/SelectRubro.jsx';
import {Loading} from '@/components/Loading.jsx';
import {searchArticulos} from '@/resources/ArticulosSearch.jsx';
import {BuscadorDeArticulosTabla} from './BuscadorDeArticulosTabla.jsx';
import {
    ARTICULOS_SEARCH_PER_PAGE,
    buildArticulosSearchFiltros,
    buildPaginationItems,
    getPaginationMeta,
    validateBuscadorArticulosFilters,
} from './buscadorDeArticulosUtils.jsx';
import {Card} from "antd";

const pageButtonClass = 'mt-0! min-w-[2rem] px-2! py-1.5! text-xs!';
const activePageButtonClass = pageButtonClass + ' font-bold! bg-slate-200! dark:bg-slate-700!';

const isTypingTarget = (target) => {
    const tagName = target?.tagName?.toLowerCase();
    return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
};

export const BuscadorDeArticulos = ({
    onArticuloSelect = null,
    onSelectedArticuloChange = null,
    className = '',
}) => {
    const [nombre, setNombre] = useState('');
    const [rubro, setRubro] = useState(null);
    const [incluirInactivos, setIncluirInactivos] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [selectedArticuloId, setSelectedArticuloId] = useState(null);
    const [submittedFilters, setSubmittedFilters] = useState(null);

    const articulos = searchResult?.data ?? [];

    const paginationMeta = useMemo(
        () => getPaginationMeta(searchResult),
        [searchResult],
    );

    const selectedArticulo = useMemo(
        () => articulos.find((item) => Number(item.id) === Number(selectedArticuloId)) ?? null,
        [articulos, selectedArticuloId],
    );

    useEffect(() => {
        onSelectedArticuloChange?.(selectedArticulo);
    }, [onSelectedArticuloChange, selectedArticulo]);

    const onSelectArticulo = useCallback((articuloId) => {
        setSelectedArticuloId(articuloId);
    }, []);

    const fetchArticulos = useCallback(async (filters, page = 1) => {
        setIsLoading(true);
        setApiError(null);

        try {
            const filtros = buildArticulosSearchFiltros(filters);
            const response = await searchArticulos({
                filtros,
                page,
                perPage: ARTICULOS_SEARCH_PER_PAGE,
            });
            setSearchResult(response);
            const firstArticuloId = response?.data?.[0]?.id ?? null;
            setSelectedArticuloId(firstArticuloId);
            return response;
        } catch (error) {
            setApiError(error?.message ?? 'No se pudo buscar artículos.');
            setSearchResult(null);
            setSelectedArticuloId(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onBuscar = useCallback(() => {
        const errors = validateBuscadorArticulosFilters({nombre, rubro});
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const filters = {nombre, rubro, incluirInactivos};
        setSubmittedFilters(filters);
        setHasSearched(true);
        void fetchArticulos(filters, 1);
    }, [nombre, rubro, incluirInactivos, fetchArticulos]);

    const onPageChange = useCallback((page) => {
        if (!submittedFilters) {
            return;
        }
        void fetchArticulos(submittedFilters, page);
    }, [submittedFilters, fetchArticulos]);

    const moveSelection = useCallback((direction) => {
        if (articulos.length === 0) {
            return;
        }

        const currentIndex = articulos.findIndex(
            (item) => Number(item.id) === Number(selectedArticuloId),
        );
        const baseIndex = currentIndex >= 0 ? currentIndex : 0;
        const nextIndex = Math.min(
            articulos.length - 1,
            Math.max(0, baseIndex + direction),
        );

        setSelectedArticuloId(articulos[nextIndex]?.id ?? null);
    }, [articulos, selectedArticuloId]);

    useEffect(() => {
        if (!hasSearched || isLoading || articulos.length === 0) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
                moveSelection(event.key === 'ArrowDown' ? 1 : -1);
                return;
            }

            if (isTypingTarget(event.target)) {
                return;
            }

            if (event.key === 'Enter' && selectedArticulo && onArticuloSelect) {
                event.preventDefault();
                onArticuloSelect(selectedArticulo);
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [
        articulos.length,
        hasSearched,
        isLoading,
        moveSelection,
        onArticuloSelect,
        selectedArticulo,
    ]);

    const paginationItems = buildPaginationItems(
        paginationMeta.currentPage,
        paginationMeta.lastPage,
    );

    return (
        <ErrorBoundary>
            <div className={className}>
                <Card>
                    <div className={'grid grid-cols-1 gap-3 md:grid-cols-4'}>
                    <div>
                        <Input
                            label={'Nombre'}
                            placeHolder={'Use % como comodín'}
                            value={nombre}
                            setValue={setNombre}
                            className={'mb-0!'}
                            errorMessage={fieldErrors.nombre}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    onBuscar();
                                }
                            }}
                        />
                    </div>
                    <div>
                        <SelectRubro
                            rubro={rubro}
                            setRubro={setRubro}
                            className={'mt-0! z-99999!'}
                            label={'Rubro'}
                            placeHolder={'Seleccione un rubro'}
                        />
                    </div>

                    <div>
                        <Checkbox
                            label={'Incluir inactivos'}
                            value={incluirInactivos}
                            onChange={setIncluirInactivos}
                            className={''}
                            left={true}
                            checkboxClassName={'mt-2! ml-8!'}
                        />
                    </div>
                    <Button
                        onClick={onBuscar}
                        disabled={isLoading}
                        className={' px-4! py-2! text-xs!'}
                    >
                        Buscar
                    </Button>
                </div>
                </Card>
                {fieldErrors.general && <LabelError className={'mt-3'}>{fieldErrors.general}</LabelError>}
                {apiError && <LabelError className={'mt-3'}>{apiError}</LabelError>}

                {isLoading && <Loading className={'my-4'} />}

                <div className={'mt-4'}>
                    <BuscadorDeArticulosTabla
                        articulos={articulos}
                        selectedArticuloId={selectedArticuloId}
                        onSelectArticulo={onSelectArticulo}
                        isLoading={isLoading}
                        hasSearched={hasSearched}
                    />
                </div>

                {hasSearched && paginationMeta.lastPage > 1 && (
                    <div className={'mt-4 flex flex-wrap items-center justify-between gap-3'}>
                        <div className={'flex flex-wrap items-center gap-1'}>
                            <CancelarButton
                                format={'xs'}
                                className={pageButtonClass}
                                disabled={isLoading || paginationMeta.currentPage <= 1}
                                onClick={() => onPageChange(paginationMeta.currentPage - 1)}
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
                                            item.value === paginationMeta.currentPage
                                                ? activePageButtonClass
                                                : pageButtonClass
                                        }
                                        disabled={isLoading || item.value === paginationMeta.currentPage}
                                        onClick={() => onPageChange(item.value)}
                                    >
                                        {item.value}
                                    </CancelarButton>
                                )
                            ))}

                            <CancelarButton
                                format={'xs'}
                                className={pageButtonClass}
                                disabled={isLoading || paginationMeta.currentPage >= paginationMeta.lastPage}
                                onClick={() => onPageChange(paginationMeta.currentPage + 1)}
                            >
                                {'>>'}
                            </CancelarButton>
                        </div>

                        <p className={'text-xs text-slate-500 dark:text-slate-300'}>
                            {paginationMeta.total > 0
                                ? `${paginationMeta.from}–${paginationMeta.to} de ${paginationMeta.total} artículos`
                                : 'Sin artículos'}
                        </p>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};
