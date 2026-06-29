import React from 'react';
import moment from 'moment';
import {useQuery} from '@tanstack/react-query';
import {LabelError} from '@/components/Label.jsx';
import {Loading} from '@/components/Loading.jsx';
import {Table} from '@/components/Table.jsx';
import {processDate} from '@/utils/dates.jsx';
import {getGastoHistorialGroupChanges, groupGastoHistorialAudits} from './gastoHistorialUtils.jsx';

export const GastoHistorialCambios = ({compraId, enabled}) => {
    const historialQuery = useQuery({
        queryKey: ['gasto-historial', compraId],
        enabled: enabled && compraId != null,
        queryFn: async () => {
            const {data} = await window.axios.get(`/api/gastos/${compraId}/historial`);
            return data ?? [];
        },
    });

    if (!enabled) {
        return null;
    }

    if (historialQuery.isLoading) {
        return (
            <div className={'mt-6 flex items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-700'}>
                <Loading/>
                <span className={'text-sm text-slate-700 dark:text-slate-200'}>Cargando historial…</span>
            </div>
        );
    }

    if (historialQuery.isError) {
        return (
            <div className={'mt-6 border-t border-gray-200 pt-4 dark:border-gray-700'}>
                <LabelError>
                    {historialQuery.error?.response?.data?.message
                        ?? historialQuery.error?.message
                        ?? 'Error al cargar el historial.'}
                </LabelError>
            </div>
        );
    }

    const historial = historialQuery.data ?? [];

    if (!historial.length) {
        return (
            <div className={'mt-6 border-t border-gray-200 pt-4 text-sm text-slate-600 dark:border-gray-700 dark:text-slate-300'}>
                No hay cambios registrados para este gasto.
            </div>
        );
    }

    const historialGroups = groupGastoHistorialAudits(historial);

    return (
        <div className={'mt-6 space-y-6 border-t border-gray-200 pt-4 dark:border-gray-700'}>
            {historialGroups.map((group) => {
                const changes = getGastoHistorialGroupChanges(group.audits);
                const tableData = changes.map((change, index) => ({
                    key: `${group.key}-${change.field}-${index}`,
                    content: [
                        {
                            key: `${group.key}-${change.field}-${index}-label`,
                            content: change.label,
                            className: 'text-slate-600 dark:text-slate-300',
                        },
                        {
                            key: `${group.key}-${change.field}-${index}-old`,
                            content: <span className={'line-through text-slate-500 dark:text-slate-400'}>{change.oldValue}</span>,
                        },
                        {
                            key: `${group.key}-${change.field}-${index}-new`,
                            content: <span className={'font-medium text-slate-800 dark:text-slate-100'}>{change.newValue}</span>,
                        },
                    ],
                }));

                return (
                    <div
                        key={group.key}
                        className={'rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40'}
                    >
                        <div className={'mb-3 text-sm text-slate-700 dark:text-slate-200'}>
                            <span className={'font-semibold'}>{group.userName}</span>
                            <span className={'mx-2 text-slate-400'}>·</span>
                            <span>{processDate(moment(group.createdAt), false, false)}</span>
                        </div>
                        <Table
                            header={[
                                {name: 'Campo'},
                                {name: 'Valor anterior'},
                                {name: 'Valor nuevo'},
                            ]}
                            data={tableData}
                            emptyText={'Sin cambios en este registro.'}
                        />
                    </div>
                );
            })}
        </div>
    );
};
