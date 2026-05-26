import React, {useEffect, useMemo, useRef, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Select} from '@/components/Select.jsx';
import uuid from 'react-uuid';
import {useArticulosRubroGastos} from '@/dataHooks/useArticulosRubroGastos.jsx';

export const SelectArticulosRubroGastos = ({
    articulo,
    setArticulo,
    errorMessage,
    className,
    label = 'Artículo',
    placeHolder = 'Seleccione artículo',
}) => {
    const {data: articulos, isLoading, isError, error} = useArticulosRubroGastos();
    const articuloIdFromProp = articulo?.id ?? articulo?.idarticulo ?? null;
    const [articuloId, setArticuloId] = useState(articuloIdFromProp);

    const articuloIdKey = useMemo(() => {
        const rawId = articulo?.id ?? articulo?.idarticulo ?? null;
        if (rawId == null || rawId === '') {
            return '';
        }
        const n = parseInt(rawId, 10);
        return Number.isFinite(n) ? String(n) : '';
    }, [articulo?.id, articulo?.idarticulo]);

    useEffect(() => {
        const nextId = articuloIdKey ? parseInt(articuloIdKey, 10) : null;
        setArticuloId((prev) => (prev === nextId ? prev : nextId));
    }, [articuloIdKey]);

    const setArticuloRef = useRef(setArticulo);
    setArticuloRef.current = setArticulo;

    useEffect(() => {
        if (isLoading || articuloId == null) {
            return;
        }
        const found = articulos?.find(
            (a) => parseInt(a.id, 10) === parseInt(articuloId, 10),
        );
        if (!found) {
            return;
        }
        const currentId = articulo?.id ?? articulo?.idarticulo;
        if (parseInt(currentId, 10) === parseInt(found.id, 10)) {
            return;
        }
        setArticuloRef.current(found);
    }, [articuloId, isLoading, articulos, articulo?.id, articulo?.idarticulo]);

    const options = useMemo(
        () => (articulos ?? []).map((a) => ({
            key: uuid(),
            value: a.id,
            label: (a?.nombre ?? 'Artículo #' + a.id).toString(),
        })),
        [articulos],
    );

    return (
        <ErrorBoundary>
            <Select
                options={options}
                value={articuloId}
                className={(className ?? '') + ' mt-4'}
                setValue={(val) => setArticuloId(val != null ? parseInt(val, 10) : null)}
                placeholder={placeHolder}
                label={label}
                errorMessage={errorMessage ?? (isError ? (error?.message ?? 'Error al cargar artículos') : null)}
                isLoading={isLoading}
                searchResultLimit={-1}
            />
        </ErrorBoundary>
    );
};
