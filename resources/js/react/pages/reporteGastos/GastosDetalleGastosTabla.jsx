import React, {useMemo, useState} from 'react';
import {Table} from '@/components/Table.jsx';
import {LabelError} from '@/components/Label.jsx';
import {Loading} from '@/components/Loading.jsx';
import {IconButton} from '@/components/Buttons.jsx';
import {faPencil} from '@fortawesome/free-solid-svg-icons';
import {processNumber} from '@/utils/numbers.jsx';
import moment from 'moment';
import {
    gastosDetalleMarginXClass,
    gastosDetalleTablaMarcoClass,
} from './gastosReporteTablaUtils.jsx';
import {GastoEditarModal} from './GastoEditarModal.jsx';

const formatFecha = (fecha) => {
    if (!fecha) {
        return '—';
    }
    const m = moment(fecha);
    return m.isValid() ? m.format('DD/MM/YYYY') : fecha;
};

export const GastosDetalleGastosTabla = ({
    titulo,
    rows,
    isLoading,
    isError,
    errorMessage,
    emptyText = 'Sin movimientos.',
    idarticulo,
    idperiodo,
    onGastoSaved,
}) => {
    const [gastoEditar, setGastoEditar] = useState(null);

    const header = useMemo(
        () => [
            {name: '', className: 'w-10'},
            {name: 'Fecha'},
            {name: 'Importe', className: 'text-right'},
            {name: 'Observaciones', className: 'pl-3'},
        ],
        [],
    );

    const data = useMemo(() => {
        return (rows ?? []).map((row, idx) => ({
            key: 'gasto-det-' + (row?.id ?? idx),
            content: [
                {
                    key: 'edit-' + idx,
                    content: (
                        <IconButton
                            icon={faPencil}
                            className={'m-0! shrink-0 inline-flex!'}
                            title={'Editar gasto'}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const compraId = Number(row?.id);
                                if (Number.isFinite(compraId)) {
                                    setGastoEditar({compraId});
                                }
                            }}
                        />
                    ),
                },
                {
                    key: 'fecha-' + idx,
                    content: formatFecha(row?.fecha),
                },
                {
                    key: 'importe-' + idx,
                    content: (
                        <div className={'text-right font-semibold text-slate-900 dark:text-slate-100'}>
                            {processNumber(Number(row?.importe ?? 0), 1, true, '$')}
                        </div>
                    ),
                },
                {
                    key: 'obs-' + idx,
                    content: (row?.observaciones ?? '—').toString(),
                    className: 'pl-3',
                },
            ],
        }));
    }, [rows]);

    if (isLoading) {
        return (
            <div className={gastosDetalleMarginXClass + ' ' + gastosDetalleTablaMarcoClass + ' px-3 py-3'}>
                {titulo ? (
                    <div className={'mb-2 text-sm font-medium text-slate-800 dark:text-slate-200'}>{titulo}</div>
                ) : null}
                <div className={'flex items-center justify-center gap-2 py-4 text-slate-700 dark:text-slate-200'}>
                    <Loading/>
                    <span className={'text-sm'}>Cargando movimientos…</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={gastosDetalleMarginXClass + ' ' + gastosDetalleTablaMarcoClass + ' px-4 py-3'}>
                {titulo ? (
                    <div className={'mb-2 text-sm font-medium text-slate-800 dark:text-slate-200'}>{titulo}</div>
                ) : null}
                <LabelError>{errorMessage ?? 'Error al cargar los movimientos.'}</LabelError>
            </div>
        );
    }

    return (
        <>
            <div className={gastosDetalleMarginXClass + ' ' + gastosDetalleTablaMarcoClass + ' px-3 py-3'}>
                {titulo ? (
                    <div className={'mb-2 text-sm font-medium text-slate-800 dark:text-slate-200'}>{titulo}</div>
                ) : null}
                <Table
                    header={header}
                    data={data}
                    emptyText={emptyText}
                    containerClassName={'detalle-gastos-movimientos'}
                />
            </div>
            <GastoEditarModal
                isOpen={gastoEditar != null}
                setIsOpen={(open) => {
                    if (!open) {
                        setGastoEditar(null);
                    }
                }}
                compraId={gastoEditar?.compraId}
                idarticuloContexto={idarticulo}
                idperiodoContexto={idperiodo}
                onSaved={onGastoSaved}
            />
        </>
    );
};
