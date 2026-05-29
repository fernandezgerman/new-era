import React, {useEffect, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Select} from '@/components/Select.jsx';
import uuid from 'react-uuid';
import {useProveedores} from '@/dataHooks/useProveedores.jsx';

export const SelectProveedor = ({
    proveedor,
    setProveedor,
    errorMessage,
    className,
    label = 'Proveedor',
    placeHolder = 'Seleccione un proveedor',
    disabled = false,
}) => {
    const {data: proveedores, isLoading, isError, error} = useProveedores();
    const [proveedorId, setProveedorId] = useState(proveedor?.id ?? null);

    useEffect(() => {
        const rawId = proveedor?.id ?? null;
        setProveedorId(
            rawId != null && rawId !== ''
                ? parseInt(rawId, 10)
                : null,
        );
    }, [proveedor?.id]);

    useEffect(() => {
        if (isLoading) {
            return;
        }
        setProveedor(
            proveedorId != null
                ? proveedores?.find((p) => parseInt(p.id, 10) === parseInt(proveedorId, 10)) ?? null
                : null,
        );
    }, [proveedorId, isLoading, proveedores, setProveedor]);

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
                setValue={(val) => setProveedorId(val != null && val !== '' ? parseInt(val, 10) : null)}
                placeholder={placeHolder}
                label={label}
                errorMessage={errorMessage ?? (isError ? (error?.message ?? 'Error al cargar proveedores') : null)}
                isLoading={isLoading}
                disabled={disabled}
                searchResultLimit={-1}
            />
        </ErrorBoundary>
    );
};
