import React, {useMemo} from 'react';
import {Table} from '@/components/Table.jsx';
import {processNumber} from '@/utils/numbers.jsx';
import {
    REPORTE_MERCADO_PAGO_TABLE_HEADER,
    buildReporteMercadoPagoTableRows,
    getReporteMercadoPagoTotal,
} from './reporteMercadoPagoUtils.jsx';

export const ReporteMercadoPagoLista = ({
    items = [],
    isLoading = false,
    hasSearched = false,
}) => {
    const tableRows = useMemo(
        () => buildReporteMercadoPagoTableRows(items),
        [items],
    );

    const total = useMemo(
        () => getReporteMercadoPagoTotal(items),
        [items],
    );

    const emptyText = hasSearched
        ? 'No se encontraron movimientos de Mercado Pago para los filtros indicados.'
        : 'Presione Buscar para cargar los resultados.';

    const footer = tableRows.length > 0 ? (
        <div className={'flex justify-end border-t border-slate-200 dark:border-slate-700 pt-4 mt-2'}>
            <div className={'text-right'}>
                <div className={'text-sm text-slate-600 dark:text-slate-500'}>Total</div>
                <div className={'text-lg font-bold text-slate-900 dark:text-slate-100'}>
                    {processNumber(total, 2, false, '$')}
                </div>
            </div>
        </div>
    ) : null;

    return (
        <Table
            header={REPORTE_MERCADO_PAGO_TABLE_HEADER}
            data={tableRows}
            isLoading={isLoading}
            emptyText={emptyText}
            destacarColumnasPares
            footer={footer}
        />
    );
};
