import React, {useState} from 'react';
import {processDate} from "@/utils/dates.jsx";
import moment from 'moment';
import {ChipGreen, ChipRed} from "@/components/Chip.jsx";
import {processNumber} from "@/utils/numbers.jsx";
import {Table} from "@/components/Table.jsx";
export const MostrarMovimientos = ({motivo, movimientos, caja}) => {

    const [selectedIds, setSelectedIds] = useState(new Set());

    const getImporteMovimiento = (movimiento) => {
        const esDeEntrada = movimiento.usuario.id !== caja.usuario.id;
        return parseFloat(movimiento.importe) * (esDeEntrada ? 1 : -1);
    };

    const toggleMovimiento = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const allSelected = movimientos.length > 0 && movimientos.every((movimiento) => selectedIds.has(movimiento.id));

    const toggleAll = (checked) => {
        setSelectedIds(checked ? new Set(movimientos.map((movimiento) => movimiento.id)) : new Set());
    };

    const totalSeleccionado = movimientos
        .filter((movimiento) => selectedIds.has(movimiento.id))
        .reduce((sum, movimiento) => sum + getImporteMovimiento(movimiento), 0);

    const header = [
        {
            key: 'descripcion',
            content: (
                <div className={'flex items-center gap-2 normal-case'}>
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(event) => toggleAll(event.target.checked)}
                        className={'rounded-1 w-4 h-4 rounded'}
                    />
                    <span>Descripción</span>
                </div>
            ),
        },
        {
            key: 'cuando',
            name: 'Cuando?',
            className: 'text-right pr-10'
        },
        {
            key: 'importe',
            name: 'Importe',
            className: 'text-right pr-10'
        }
    ];

    const GenerarDescripcion = ({movimiento, esDeEntrada, checked, onToggle}) => {
        const usuarioNombre = esDeEntrada ? movimiento.usuario.nombre_completo : movimiento.usuario_destino.nombre_completo;
        return (
            <div className={'flex items-center gap-2'}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(movimiento.id)}
                    className={'rounded-1 w-4 h-4'}
                />
                {esDeEntrada ? <ChipGreen>{usuarioNombre}</ChipGreen> : <ChipRed>{usuarioNombre}</ChipRed>}
            </div>
        );
    };

    const data = movimientos?.map((movimiento) => {
        const esDeEntrada = movimiento.usuario.id !== caja.usuario.id;

        return {
            key: movimiento.id,
            className: '',
            content: [
                {
                    content: (
                        <GenerarDescripcion
                            movimiento={movimiento}
                            esDeEntrada={esDeEntrada}
                            checked={selectedIds.has(movimiento.id)}
                            onToggle={toggleMovimiento}
                        />
                    ),
                },
                {content: processDate(moment(movimiento.fechahoramovimiento)), className: 'text-right pr-10'},
                {content: processNumber(getImporteMovimiento(movimiento), 2, false, '$'), className: 'text-right pr-10'}
            ]
        };
    }) ?? [];

    return <>
        <Table
            top={<div className={'text-center mt-4 font-bold italic'}>{motivo}</div>}
            className={'mt-5 max-h-[calc(500px)]'}
            isLoading={false}
            destacarColumnasPares
            header={header}
            data={data}
            emptyText={'No se encontraron Movimientos'}
        />

        {selectedIds.size > 0 && (
            <div className={'sticky bottom-0 z-10 mt-4 w-full bg-gray-300 p-3 font-bold flex justify-between items-center rounded shadow-md'}>
                <div>Total seleccionado</div>
                <div>{processNumber(totalSeleccionado, 2, false, '$')}</div>
            </div>
        )}
    </>;
};
