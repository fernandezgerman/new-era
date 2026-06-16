import React, {useEffect, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Select} from '@/components/Select.jsx';
import uuid from 'react-uuid';
import {useProveedores} from '@/dataHooks/useProveedores.jsx';

export const SelectProveedor = ({
    proveedor,
    setProveedor = () => {},
    errorMessage,
    className,
    label = 'Proveedor',
    placeHolder = 'Seleccione un proveedor',
    disabled = false,
    multiple = false,
}) => {
    const {data: proveedores, isLoading, isError, error} = useProveedores();
    const [proveedorId, setProveedorId] = useState(
        multiple
            ? (proveedor?.map((p) => parseInt(p.id, 10)) ?? [])
            : (proveedor?.id ?? null),
    );

    useEffect(() => {
        if (multiple || isLoading) {
            return;
        }
        const rawId = proveedor?.id ?? null;
        setProveedorId(
            rawId != null && rawId !== ''
                ? parseInt(rawId, 10)
                : null,
        );
    }, [proveedor?.id, isLoading, multiple]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (multiple) {
            const selected = proveedores?.filter((p) => proveedorId?.includes(parseInt(p.id, 10))) ?? [];
            setProveedor(selected);
            return;
        }

        setProveedor(
            proveedorId != null
                ? proveedores?.find((p) => parseInt(p.id, 10) === parseInt(proveedorId, 10)) ?? null
                : null,
        );
    }, [proveedorId, isLoading, multiple, proveedores, setProveedor]);

    return (
        <ErrorBoundary>
            <Select
                options={
                    proveedores?.map((p) => ({
                        key: uuid(),
                        value: p.id,
                        label: (p?.nombre ?? 'Proveedor #' + p.id).toString(),
                    })) ?? []
                }
                value={proveedorId}
                className={(className ?? '') + ' mt-4'}
                setValue={(val) => {
                    if (multiple) {
                        setProveedorId(val.map((v) => parseInt(v, 10)));
                    } else {
                        setProveedorId(val != null && val !== '' ? parseInt(val, 10) : null);
                    }
                }}
                placeholder={placeHolder}
                label={label}
                errorMessage={errorMessage ?? (isError ? (error?.message ?? 'Error al cargar proveedores') : null)}
                isLoading={isLoading}
                disabled={disabled}
                searchResultLimit={-1}
                multiple={multiple}
                allowRemove={multiple}
            />
        </ErrorBoundary>
    );
};
