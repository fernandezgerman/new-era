import React from 'react';

export const GastoEditarCampo = ({label, value, children}) => {
    return (
        <div>
            <div className={'text-xs font-bold uppercase text-slate-500 dark:text-slate-500'}>
                {label}
            </div>
            <div className={'mt-1 text-sm text-slate-900 dark:text-slate-100'}>
                {children ?? (value != null && value !== '' ? value : '—')}
            </div>
        </div>
    );
};
