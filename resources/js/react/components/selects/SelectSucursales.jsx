import React, {useEffect, useState} from 'react';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {Select} from "@/components/Select.jsx";
import uuid from "react-uuid";

import {useSucursales} from "@/dataHooks/useSucursales.jsx";
export const SelectSucursal = ({setSucursal, sucursal, errorMessage, className, multiple = false, label = null, placeHolder}) => {
    const {data: sucursales, isLoading} = useSucursales();
    const [sucursalId, setSucursalId] = useState(multiple ? (sucursal?.map(s => s.id) ?? []) : (sucursal?.id ?? null));

    useEffect(() => {
        if(isLoading) return;

        if (multiple) {
            const selected = sucursales?.filter(s => sucursalId?.includes(parseInt(s.id))) ?? [];
            setSucursal(selected);
        } else {
            setSucursal(
                sucursalId !== null ? sucursales?.find(
                        (sucursal) => parseInt(sucursal.id) === parseInt(sucursalId))
                    :null);
        }
    }, [sucursalId, isLoading]);


    return <ErrorBoundary>
        <Select
            options={sucursales?.map((sucursal) => ({key: uuid(), value: sucursal.id, label: sucursal.nombre})) ?? []}
            value={sucursalId}
            className={className + ' mt-4'}
            setValue={(val) => {
                if (multiple) {
                    setSucursalId(val.map(v => parseInt(v)));
                } else {
                    setSucursalId(val !== null ? parseInt(val) : null);
                }
            }}
            placeholder={placeHolder ?? "Seleccione una sucursal"}
            label={label ?? 'Sucursal'}
            errorMessage={errorMessage}
            multiple={multiple}
            allowRemove={multiple}
        />
    </ErrorBoundary>

}
