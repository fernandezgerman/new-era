import React, {useMemo} from 'react';
import {Table} from '@/components/Table.jsx';
import {
    EXISTENCIAS_SIN_COMPRAS_TABLE_HEADER,
    buildExistenciasSinComprasTableRows,
} from './existenciasSinComprasUtils.jsx';

export const ExistenciasSinComprasLista = ({
    items = [],
    isLoading = false,
    hasSearched = false,
}) => {
    const tableRows = useMemo(
        () => buildExistenciasSinComprasTableRows(items),
        [items],
    );

    const emptyText = hasSearched
        ? 'No se encontraron artículos con existencia sin compras en el período indicado.'
        : <div className={'w-full text-center align-middle h-full '}>
            Presione Buscar para cargar los resultados.
            <br /><br />
                    <p><b>ATENCION: Utilice los filtros antes de buscar, en caso contrario puede tardar minutos en cargar la informacion</b></p>

        </div>;

    return (
        <Table
            header={EXISTENCIAS_SIN_COMPRAS_TABLE_HEADER}
            data={tableRows}
            isLoading={isLoading}
            emptyText={emptyText}
            destacarColumnasPares
        />
    );
};
