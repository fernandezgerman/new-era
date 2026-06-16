import React, {useCallback, useEffect, useRef, useTransition} from 'react';
import {ChipYellow} from '@/components/Chip.jsx';
import {parseExistenciaCantidad, scrollElementToContainerTop} from './ordenesDeCompraAgregarUtils.jsx';
import {ArticulosAOrdenarFilaDetalle} from './ArticulosAOrdenarFilaDetalle.jsx';
import {ArticulosAOrdenarProveedorSelect} from './ArticulosAOrdenarProveedorSelect.jsx';
import {AlertDanger} from "@/components/Alerts.jsx";

const inputFieldClass =
    'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 '
    + 'outline-none focus:border-fuchsia-300 dark:ne-dark-input! dark:border-slate-600 dark:text-slate-100';

export const ArticulosAOrdenarFila = React.memo(({
    item,
    articuloId,
    isActive,
    rowEdit,
    onActivate,
    onRowEditChange,
    scrollContainerRef = null,
    registerCantidadInputRef,
    onCantidadEnter,
}) => {
    const [, startTransition] = useTransition();
    const cantidadInputRef = useRef(null);
    const articulo = item?.articulos ?? {};

    const setCantidadInputRef = useCallback((element) => {
        cantidadInputRef.current = element;
        registerCantidadInputRef?.(articuloId, element);
    }, [articuloId, registerCantidadInputRef]);

    const scrollCantidadIntoView = useCallback(() => {
        const scroll = () => {
            scrollElementToContainerTop(
                cantidadInputRef.current,
                scrollContainerRef?.current,
            );
        };

        requestAnimationFrame(() => {
            requestAnimationFrame(scroll);
        });
    }, [scrollContainerRef]);

    const handleActivate = useCallback(() => {
        startTransition(() => {
            onActivate(articuloId);
        });
    }, [articuloId, onActivate]);

    const focusCantidadInput = useCallback(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                cantidadInputRef.current?.focus();
            });
        });
    }, []);

    const handleProveedorChange = useCallback((proveedor) => {
        onRowEditChange({proveedor});
        focusCantidadInput();
    }, [focusCantidadInput, onRowEditChange]);

    const handleCantidadFocus = useCallback((e) => {
        e.target.select();
        startTransition(() => {
            onActivate(articuloId);
        });
        scrollCantidadIntoView();
    }, [articuloId, onActivate, scrollCantidadIntoView]);

    useEffect(() => {
        if (!isActive || document.activeElement !== cantidadInputRef.current) {
            return;
        }
        scrollCantidadIntoView();
    }, [isActive, scrollCantidadIntoView]);

    const handleCantidadChange = useCallback((e) => {
        const raw = e.target.value;
        onRowEditChange({
            cantidad: raw === '' ? null : parseInt(raw, 10),
        });
    }, [onRowEditChange]);

    const handleCantidadKeyDown = useCallback((e) => {
        if (e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        onCantidadEnter?.(articuloId);
    }, [articuloId, onCantidadEnter]);

    const cantidadCargada = parseInt(rowEdit?.cantidad) !== 0 && !(rowEdit?.cantidad === undefined) && rowEdit?.cantidad !== null;

    const mustSelectAproveedor = (cantidadCargada && !(rowEdit?.cantidad === null) && (
        rowEdit?.proveedor === undefined || rowEdit?.proveedor === null || !rowEdit?.proveedor));
    const getRowClass = () => {

        if (mustSelectAproveedor)
            return 'border-red-300 bg-red-200 dark:border-red-600 dark:bg-red-800';

        if (parseInt(rowEdit?.cantidad) !== 0 && !(rowEdit?.cantidad === undefined) && !(rowEdit?.cantidad === null) && !(
            rowEdit?.proveedor === undefined || rowEdit?.proveedor === null || !rowEdit?.proveedor))
            return 'border-green-300 bg-green-200 dark:border-green-600 dark:bg-green-800';

        if (isActive )
            return 'my-7! border-blue-300 bg-blue-200 dark:border-blue-600 dark:bg-blue-800';

        return 'border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/40';
    };

    const selectedProviderType = cantidadCargada && !mustSelectAproveedor &&
        (item?.proveedores?.recomendado?.id > 0) &&
        (rowEdit?.proveedor?.id !== item?.proveedores?.recomendado?.id)
        ? ' border-b-4! border-yellow-200! ' : '';

    return (
        <div
            className={
                'cursor-pointer rounded-lg border border-transparent px-2 py-2 transition-all mb-2 '
                + getRowClass()
            }
            onClick={handleActivate}
        >
            <div className={'grid grid-cols-1 gap-3 md:grid-cols-15 md:items-top'}>
                <div className={'col-span-6'}>
                    <span className={'text-xl font-medium text-slate-900 dark:text-slate-100'}>
                        {articulo?.nombre ?? '—'}
                    </span>
                    <br/>
                    <span className={'text-sm text-slate-600 dark:text-slate-300'}>
                        {articulo?.codigo ?? '—'}
                        {!item?.existencias && <ChipYellow>Sin stock</ChipYellow>}
                    </span>
                </div>

                <div className={'text-sm text-slate-800 dark:text-slate-300! col-span-2'}>
                    {articulo?.rubro?.nombre ?? '—'}
                    <span className={'text-slate-500 dark:text-slate-400!'}>
                        ({articulo?.marca?.nombre ?? '—'})
                    </span>
                </div>

                <div className={'text-sm text-slate-800 dark:text-slate-100!'}>
                    #{parseExistenciaCantidad(item?.existencias)}
                </div>

                <div
                    className={'col-span-4'}
                    onClick={(e) => e.stopPropagation()}
                >
                    {isActive ? (
                        <ArticulosAOrdenarProveedorSelect
                            value={rowEdit?.proveedor ?? null}
                            onChange={handleProveedorChange}
                            className={selectedProviderType}
                        />
                    ) : (
                        <div
                            className={'truncate font-bold text-sm text-slate-800 dark:text-slate-100! pb-2 ' + selectedProviderType}>
                        {rowEdit?.proveedor?.nombre ?? (mustSelectAproveedor ? <AlertDanger className={'w-auto! mt-0! p-2'}>Seleccione proveedor</AlertDanger> : '-')}
                        </div>
                    )}
                </div>

                <div className={'col-span-2'} onClick={(e) => e.stopPropagation()}>
                    <input
                        ref={setCantidadInputRef}
                        type={'number'}
                        min={0}
                        className={inputFieldClass}
                        placeholder={'Cantidad'}
                        value={rowEdit?.cantidad ?? ''}
                        onFocus={handleCantidadFocus}
                        onChange={handleCantidadChange}
                        onKeyDown={handleCantidadKeyDown}
                    />
                </div>
            </div>

            {isActive ? (
                <ArticulosAOrdenarFilaDetalle
                    item={item}
                    onSelectProveedor={handleProveedorChange}
                />
            ) : null}
        </div>
    );
});

ArticulosAOrdenarFila.displayName = 'ArticulosAOrdenarFila';
