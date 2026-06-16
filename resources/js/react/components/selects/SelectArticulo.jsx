import React, {useEffect, useMemo, useRef, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Select} from '@/components/Select.jsx';
import uuid from 'react-uuid';
import {useArticulosSelect} from '@/dataHooks/useArticulosSelect.jsx';

export const SelectArticulo = ({
    articulo,
    setArticulo,
    errorMessage,
    className,
    label = 'Artículo',
    placeHolder = 'Seleccione un artículo',
    disabled = false,
}) => {
    const {data: articulos, isLoading, isError, error} = useArticulosSelect();
    const [articuloId, setArticuloId] = useState(articulo?.id ?? null);

    useEffect(() => {
        const rawId = articulo?.id ?? null;
        setArticuloId(rawId != null ? parseInt(rawId, 10) : null);
    }, [articulo?.id]);

    const setArticuloRef = useRef(setArticulo);
    setArticuloRef.current = setArticulo;

    useEffect(() => {
        if (isLoading) {
            return;
        }
        setArticuloRef.current(
            articuloId != null
                ? articulos?.find((a) => parseInt(a.id, 10) === parseInt(articuloId, 10)) ?? null
                : null,
        );
    }, [articuloId, isLoading, articulos]);

    const options = useMemo(
        () => (articulos ?? []).map((a) => ({
            key: uuid(),
            value: a.id,
            label: ((a?.codigo ? a.codigo + ' - ' : '') + (a?.nombre ?? 'Artículo #' + a.id)).toString(),
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
                disabled={disabled}
                searchResultLimit={-1}
            />
        </ErrorBoundary>
    );
};
