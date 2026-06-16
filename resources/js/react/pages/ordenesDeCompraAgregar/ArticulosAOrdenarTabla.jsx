import React, {useCallback, useEffect, useRef, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {DivCenterContentHyV} from '@/components/Containers/DivCenterContentHyV.jsx';
import {
    buildPageRowEdits,
    getArticuloItemId,
    hasCantidadSet,
} from './ordenesDeCompraAgregarUtils.jsx';
import {ArticulosAOrdenarFila} from './ArticulosAOrdenarFila.jsx';

const HEADER_COLUMNS = [
    {key: 'articulo', label: 'Artículo'},
    {key: 'rubro', label: 'Rubro / Marca'},
    {key: 'existencia', label: 'Existencia'},
    {key: 'proveedor', label: 'Proveedor'},
    {key: 'cantidad', label: 'Cantidad'},
];

export const ArticulosAOrdenarTabla = ({
    articulos = [],
    sucursalId = null,
    persistedRowEdits = {},
    onPersistRowEdit,
    onClearPersistedRowEdit,
    scrollContainerRef = null,
    onGoToNextPage,
    focusFirstCantidadOnLoad = false,
    onFocusFirstCantidadHandled,
    isTableLoading = false,
}) => {
    const [activeRowId, setActiveRowId] = useState(null);
    const [rowEdits, setRowEdits] = useState(() =>
        buildPageRowEdits(articulos, sucursalId, persistedRowEdits),
    );
    const persistedRowEditsRef = useRef(persistedRowEdits);
    const cantidadInputRefs = useRef({});
    persistedRowEditsRef.current = persistedRowEdits;

    useEffect(() => {
        setRowEdits(buildPageRowEdits(articulos, sucursalId, persistedRowEditsRef.current));
        setActiveRowId(null);
    }, [articulos, sucursalId]);

    useEffect(() => {
        if (!focusFirstCantidadOnLoad || isTableLoading || (articulos ?? []).length === 0) {
            return;
        }

        const firstId = getArticuloItemId(articulos[0]);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                cantidadInputRefs.current[firstId]?.focus();
                onFocusFirstCantidadHandled?.();
            });
        });
    }, [articulos, focusFirstCantidadOnLoad, isTableLoading, onFocusFirstCantidadHandled]);

    const registerCantidadInputRef = useCallback((articuloId, element) => {
        if (element) {
            cantidadInputRefs.current[articuloId] = element;
            return;
        }
        delete cantidadInputRefs.current[articuloId];
    }, []);

    const activateRow = useCallback((articuloId) => {
        const id = parseInt(articuloId, 10);
        setActiveRowId((prev) => (prev === id ? prev : id));
    }, []);

    const updateRowEdit = useCallback((articuloId, patch, item) => {
        setRowEdits((prev) => {
            const next = {
                ...prev[articuloId],
                ...patch,
            };

            if (hasCantidadSet(next)) {
                onPersistRowEdit?.(articuloId, next, item);
            } else if (persistedRowEditsRef.current[articuloId]) {
                onClearPersistedRowEdit?.(articuloId);
            }

            return {
                ...prev,
                [articuloId]: next,
            };
        });
    }, [onClearPersistedRowEdit, onPersistRowEdit]);

    const handleCantidadEnter = useCallback((articuloId) => {
        const articuloIds = (articulos ?? []).map((item) => getArticuloItemId(item));
        const currentIndex = articuloIds.findIndex(
            (id) => parseInt(id, 10) === parseInt(articuloId, 10),
        );

        if (currentIndex >= 0 && currentIndex < articuloIds.length - 1) {
            const nextId = articuloIds[currentIndex + 1];
            cantidadInputRefs.current[nextId]?.focus();
            return;
        }

        onGoToNextPage?.();
    }, [articulos, onGoToNextPage]);

    if ((articulos ?? []).length === 0) {
        return (
            <DivCenterContentHyV className={'w-full p-6 text-slate-600 dark:text-slate-400'}>
                No se encontraron artículos para los filtros seleccionados.
            </DivCenterContentHyV>
        );
    }

    return (
        <ErrorBoundary>
            <div className={'w-full'}>
                <div
                    className={
                        'hidden gap-2 border-b border-slate-200 px-3 pb-2 text-xxs font-bold uppercase '
                        + 'text-slate-500 dark:border-slate-700 dark:text-slate-400 md:grid md:grid-cols-5'
                    }
                >
                    {HEADER_COLUMNS.map((col) => (
                        <div key={col.key}>{col.label}</div>
                    ))}
                </div>

                <div className={'flex flex-col'}>
                    {(articulos ?? []).map((item) => {
                        const articuloId = getArticuloItemId(item);

                        return (
                            <ArticulosAOrdenarFila
                                key={articuloId}
                                item={item}
                                articuloId={articuloId}
                                isActive={activeRowId === parseInt(articuloId, 10)}
                                rowEdit={rowEdits[articuloId]}
                                onActivate={activateRow}
                                onRowEditChange={(patch) => updateRowEdit(articuloId, patch, item)}
                                scrollContainerRef={scrollContainerRef}
                                registerCantidadInputRef={registerCantidadInputRef}
                                onCantidadEnter={handleCantidadEnter}
                            />
                        );
                    })}
                </div>
            </div>
        </ErrorBoundary>
    );
};
