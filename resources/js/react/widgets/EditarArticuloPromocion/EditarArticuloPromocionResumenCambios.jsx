import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {DeleteIconButton} from '@/components/Buttons.jsx';
import {DivCenterContentHyV} from '@/components/Containers/DivCenterContentHyV.jsx';
import {
    formatActivo,
    formatCantidad,
    formatPrecio,
    numbersEqual,
    booleansEqual,
} from './editarArticuloPromocionUtils.jsx';

const ValueChange = ({label, original, current, formatter = (value) => value, isNew = false}) => {
    if (isNew) {
        return (
            <div className={'text-sm'}>
                <span className={'font-semibold text-slate-600 dark:text-slate-300'}>{label}: </span>
                <span className={'font-semibold text-slate-900 dark:text-white'}>{formatter(current)}</span>
            </div>
        );
    }

    const changed = typeof original !== 'boolean'
        ? !numbersEqual(original, current)
        : !booleansEqual(original, current);

    if (!changed) {
        return null;
    }

    return (
        <div className={'text-sm'}>
            <span className={'font-semibold text-slate-600 dark:text-slate-300'}>{label}: </span>
            <span className={'text-red-600 line-through dark:text-red-400'}>{formatter(original)}</span>
            <span className={'mx-2 text-slate-500'}>{'→'}</span>
            <span className={'font-semibold text-slate-900 dark:text-white'}>{formatter(current)}</span>
        </div>
    );
};

export const EditarArticuloPromocionResumenCambios = ({
    changedRecords = [],
    onRevertChange,
}) => {
    if (changedRecords.length === 0) {
        return (
            <div className={'w-full p-6 text-slate-600 dark:text-slate-400  items-center justify-center'}>
                No hay cambios para revisar.
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className={'flex flex-col gap-3'}>
                {changedRecords.map((item) => (
                    <div
                        key={item.id}
                        className={
                            'flex items-start justify-between gap-3 rounded-lg border border-slate-200 '
                            + 'bg-white p-4 dark:border-slate-700 dark:bg-slate-900/40'
                        }
                    >
                        <div className={'flex min-w-0 flex-1 flex-col gap-1'}>
                            <div className={'font-semibold text-slate-900 dark:text-white'}>
                                {item.isNew && <span className={'mr-2 text-green-600 dark:text-green-400'}>[Nuevo]</span>}
                                {item.articuloLabel}
                            </div>
                            <ValueChange
                                label={'Cantidad'}
                                original={item.original.cantidad}
                                current={item.current.cantidad}
                                formatter={formatCantidad}
                                isNew={item.isNew}
                            />
                            <ValueChange
                                label={'Precio'}
                                original={item.original.precio}
                                current={item.current.precio}
                                formatter={formatPrecio}
                                isNew={item.isNew}
                            />
                            <ValueChange
                                label={'Activo'}
                                original={item.original.activo}
                                current={item.current.activo}
                                formatter={formatActivo}
                                isNew={item.isNew}
                            />
                        </div>

                        <DeleteIconButton
                            title={'Revertir cambios'}
                            onClick={() => onRevertChange(item.id)}
                        />
                    </div>
                ))}
            </div>
        </ErrorBoundary>
    );
};
