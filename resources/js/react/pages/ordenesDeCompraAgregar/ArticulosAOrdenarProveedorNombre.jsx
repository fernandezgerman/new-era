import React from 'react';

const linkClassName =
    'cursor-pointer underline decoration-slate-500 underline-offset-2 '
    + 'text-slate-900 hover:text-fuchsia-600 dark:text-slate-100 dark:hover:text-fuchsia-400 '
    + 'dark:decoration-slate-400';

export const ArticulosAOrdenarProveedorNombre = ({
    proveedor,
    onSelectProveedor,
    className = '',
    center = false,
}) => {
    const nombre = proveedor?.nombre ?? '—';
    const proveedorId = parseInt(proveedor?.id, 10);
    const canSelect = Number.isFinite(proveedorId) && proveedorId > 0 && onSelectProveedor;

    const handleSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectProveedor?.(proveedor);
    };

    if (!canSelect) {
        return (
            <span className={className + (center ? ' block text-center ' : '')}>
                {nombre}
            </span>
        );
    }

    return (
        <button
            type={'button'}
            title={'Usar este proveedor'}
            onClick={handleSelect}
            className={
                linkClassName
                + (center ? ' block w-full text-center ' : ' inline ')
                + className
            }
        >
            {nombre}
        </button>
    );
};
