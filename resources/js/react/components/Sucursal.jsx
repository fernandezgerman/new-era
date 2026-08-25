import React from 'react';
import {useSucursal} from '@/dataHooks/useSucursales.jsx';

export const Sucursal = ({idsucursal, className = ''}) => {
    const {data: sucursal, isLoading} = useSucursal(idsucursal);

    if (isLoading) {
        return <span className={`italic ${className}`}>Loading</span>;
    }

    if (!sucursal) {
        return null;
    }

    const inactivo = sucursal.activo != 1;

    return (
        <span className={`${inactivo ? 'text-red-500 line-through ' : ''}${className}`}>
            {sucursal.nombre}
        </span>
    );
};
