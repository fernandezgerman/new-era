import React, {useMemo} from 'react';
import {useProveedores} from '@/dataHooks/useProveedores.jsx';

const selectClass =
    'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 '
    + 'outline-none focus:border-fuchsia-300 dark:ne-dark-input! dark:border-slate-600 dark:text-slate-100';

const generarHeaderSelectClass =
    'text-base font-semibold py-0! px-1! min-h-0! h-auto! w-auto! max-w-full border-0! bg-transparent! '
    + 'shadow-none! outline-none! focus:border-fuchsia-300! dark:bg-transparent!';

export const ArticulosAOrdenarProveedorSelect = React.memo(({
    value = null,
    onChange,
    disabled = false,
    className = '',
    placeholder = 'Seleccione proveedor',
    variant = 'default',
}) => {
    const {data: proveedores = [], isLoading, isError} = useProveedores();
    const selectedId = value?.id != null ? String(value.id) : '';

    const sortedProveedores = useMemo(
        () => [...proveedores].sort((a, b) => (a?.nombre ?? '').localeCompare(b?.nombre ?? '', 'es')),
        [proveedores],
    );

    const isDisabled = disabled || isLoading || isError || sortedProveedores.length === 0;
    const baseClass = variant === 'generar-header' ? generarHeaderSelectClass : selectClass;

    return (
        <select
            className={baseClass + (isLoading ? ' opacity-60 ' : '') + ' ' + className}
            value={selectedId}
            disabled={isDisabled}
            onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') {
                    onChange(null);
                    return;
                }
                const id = parseInt(raw, 10);
                onChange(sortedProveedores.find((p) => parseInt(p.id, 10) === id) ?? null);
            }}
        >
            <option value="">
                {isLoading
                    ? 'Cargando proveedores...'
                    : (isError
                        ? 'Error al cargar proveedores'
                        : (sortedProveedores.length === 0 ? 'Sin proveedores' : placeholder))}
            </option>
            {sortedProveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                </option>
            ))}
        </select>
    );
});

ArticulosAOrdenarProveedorSelect.displayName = 'ArticulosAOrdenarProveedorSelect';
