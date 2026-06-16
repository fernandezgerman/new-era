import React, {useEffect, useMemo, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Select} from '@/components/Select.jsx';
import uuid from 'react-uuid';
import {useMarcas} from '@/dataHooks/useMarcas.jsx';

export const SelectMarca = ({
    marca,
    setMarca,
    errorMessage,
    className,
    label = 'Marcas',
    placeHolder = 'Seleccione marcas (opcional)',
    disabled = false,
    multiple = true,
}) => {
    const {data: marcas, isLoading, isError, error} = useMarcas();
    const [marcaId, setMarcaId] = useState(
        multiple
            ? (marca?.map((m) => parseInt(m.id, 10)) ?? [])
            : (marca?.id ?? null),
    );

    useEffect(() => {
        if (multiple || isLoading) {
            return;
        }
        const rawId = marca?.id ?? null;
        setMarcaId(rawId != null ? parseInt(rawId, 10) : null);
    }, [marca?.id, isLoading, multiple]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (multiple) {
            const selected = marcas?.filter((m) => marcaId?.includes(parseInt(m.id, 10))) ?? [];
            setMarca(selected);
            return;
        }

        setMarca(
            marcaId != null
                ? marcas?.find((m) => parseInt(m.id, 10) === parseInt(marcaId, 10)) ?? null
                : null,
        );
    }, [marcaId, isLoading, marcas, multiple, setMarca]);

    const options = useMemo(
        () => (marcas ?? []).map((m) => ({
            key: uuid(),
            value: m.id,
            label: (m?.nombre ?? 'Marca #' + m.id).toString(),
        })),
        [marcas],
    );

    return (
        <ErrorBoundary>
            <Select
                options={options}
                value={marcaId}
                className={(className ?? '') + ' mt-4'}
                setValue={(val) => {
                    if (multiple) {
                        setMarcaId(val.map((v) => parseInt(v, 10)));
                    } else {
                        setMarcaId(val != null ? parseInt(val, 10) : null);
                    }
                }}
                placeholder={placeHolder}
                label={label}
                errorMessage={errorMessage ?? (isError ? (error?.message ?? 'Error al cargar marcas') : null)}
                isLoading={isLoading}
                disabled={disabled}
                searchResultLimit={-1}
                multiple={multiple}
                allowRemove={multiple}
            />
        </ErrorBoundary>
    );
};
