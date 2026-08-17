import React, {useMemo} from 'react';
import {Table} from '@/components/Table.jsx';
import {processNumber} from '@/utils/numbers.jsx';
import {
    MOVIMIENTOS_CAJA_TOTALIZADO_TABLE_HEADER,
    buildMovimientosCajaTotalizadoTableRows,
    getMovimientosCajaTotalizadoItems,
    getMovimientosCajaTotalizadoTotal,
} from './reporteMovimientosCajaUtils.jsx';

export const ReporteMovimientosCajaTotalizadoLista = ({
    data = null,
    isLoading = false,
    hasSearched = false,
}) => {
    const items = useMemo(
        () => getMovimientosCajaTotalizadoItems(data),
        [data],
    );

    const tableRows = useMemo(
        () => buildMovimientosCajaTotalizadoTableRows(items),
        [items],
    );

    const total = useMemo(
        () => getMovimientosCajaTotalizadoTotal(data, items),
        [data, items],
    );

    const emptyText = hasSearched
        ? 'No se encontraron totales de movimientos de caja para los filtros indicados.'
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
            header={MOVIMIENTOS_CAJA_TOTALIZADO_TABLE_HEADER}
            data={tableRows}
            isLoading={isLoading}
            emptyText={emptyText}
            destacarColumnasPares
            footer={footer}
        />
    );
};
