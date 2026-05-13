import React from 'react';

export const GastosDetalleSeccionHeader = ({titulo}) => {
    if (!titulo?.trim()) {
        return null;
    }
    return (
        <div
            className={
                'mb-3 text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 ' +
                'border-b border-slate-200 dark:border-slate-700 pb-2'
            }
        >
            {titulo.trim()}
        </div>
    );
};
