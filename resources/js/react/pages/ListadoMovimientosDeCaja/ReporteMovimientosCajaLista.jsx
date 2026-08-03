import React, {useMemo} from 'react';
import {Table} from '@/components/Table.jsx';
import {
    MOVIMIENTOS_CAJA_TABLE_HEADER,
    buildMovimientosCajaTableRows,
} from './reporteMovimientosCajaUtils.jsx';

export const ReporteMovimientosCajaLista = ({
    items = [],
    isLoading = false,
    hasSearched = false,
}) => {
    const tableRows = useMemo(
        () => buildMovimientosCajaTableRows(items),
        [items],
    );

    const emptyText = hasSearched
        ? 'No se encontraron movimientos de caja para los filtros indicados.'
        : 'Presione Buscar para cargar los resultados.';

    return (
        <Table
            header={MOVIMIENTOS_CAJA_TABLE_HEADER}
            data={tableRows}
            isLoading={isLoading}
            emptyText={emptyText}
            destacarColumnasPares
        />
    );
};
