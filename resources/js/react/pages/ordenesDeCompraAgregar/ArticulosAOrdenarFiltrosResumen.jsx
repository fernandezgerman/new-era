import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Label} from '@/components/Label.jsx';
import {formatBooleanFilter, formatEntityList} from './ordenesDeCompraAgregarUtils.jsx';

const ResumenItem = ({label, value}) => (
    <div className={'flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm'}>
        <Label className={'mb-0! pl-0! text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400'}>
            {label}:
        </Label>
        <span className={'font-medium text-slate-900 dark:text-slate-100'}>{value}</span>
    </div>
);

export const ArticulosAOrdenarFiltrosResumen = ({filters}) => {
    const rubrosLabel = formatEntityList(filters?.rubros);
    const sucursalLabel = filters?.sucursal?.nombre ?? '—';
    const marcasLabel = (filters?.marcas?.length ?? 0) > 0
        ? formatEntityList(filters.marcas)
        : 'Todas';

    return (
        <ErrorBoundary>
            <div className={'flex flex-wrap items-center gap-x-6 gap-y-2'}>
                <ResumenItem label={'Sucursal'} value={sucursalLabel} />
                <ResumenItem label={'Rubros'} value={rubrosLabel} />
                <ResumenItem label={'Días de ventas'} value={filters?.diasventas ?? '—'} />
                <ResumenItem label={'Marcas'} value={marcasLabel} />
                <ResumenItem label={'Solo stock activo'} value={formatBooleanFilter(filters?.soloStockActivo)} />
                <ResumenItem label={'Solo vendidos'} value={formatBooleanFilter(filters?.soloVendidos)} />
            </div>
        </ErrorBoundary>
    );
};
