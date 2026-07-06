import React, {useState} from 'react';
import {processDate} from "@/utils/dates.jsx";
import moment from 'moment';
import {ChipGreen, ChipRed} from "@/components/Chip.jsx";
import {processNumber} from "@/utils/numbers.jsx";
import {Table} from "@/components/Table.jsx";
import {ToolTipWrapper} from "@/components/ToolTipWrapper.jsx";
import {PopOver} from "@/components/PopOver.jsx";
export const MostrarCompra = ({titulo, compras, tipo}) => {

    const [selectedIds, setSelectedIds] = useState(new Set());

    const toggleCompra = (id) => {
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

    const allSelected = compras.length > 0 && compras.every((compra) => selectedIds.has(compra.id));

    const toggleAll = (checked) => {
        setSelectedIds(checked ? new Set(compras.map((compra) => compra.id)) : new Set());
    };

    const totalSeleccionado = compras
        .filter((compra) => selectedIds.has(compra.id))
        .reduce((sum, compra) => sum + compra.totalfactura, 0);

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

    const GenerarDescripcionImpuestosEnCobros = ({compra, checked, onToggle}) => {
        const obsDivided = compra?.observaciones?.replace('CARGO POR mercadopago_fee', '')?.split('IMPUESTO POR tax_withholding-caba');

        const cleanObservaciones = obsDivided?.length === 2 ?
            <div className={'grid grid-cols-2'}>
                <div className={'font-bold'}>{titulo}: </div>
                <div>{obsDivided[0]}</div>
                <div className={'font-bold'} >IIBB:</div>
                <div> {obsDivided[1]} </div>
            </div>
            : compra?.observaciones;
        return (
            <div className={'flex items-center gap-2'}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(compra.id)}
                    className={'rounded-1 w-4 h-4'}
                />
                <PopOver
                    title={'Detalle'}
                    className={'w-[500px]'}
                    content={cleanObservaciones}>
                    Servicio + Impuestos
                </PopOver>
            </div>
        );
    };

    const GenerarDescripcionGastosGenerales = ({compra, checked, onToggle}) => {

        return (
            <div className={'flex items-center gap-2'}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(compra.id)}
                    className={'rounded-1 w-4 h-4'}
                />
                <b>{compra.compra_detalles[0]?.articulo?.nombre}</b> - {compra.compra_detalles[0]?.articulo?.rubro?.nombre + ')' ?? 'n/a'}
            </div>
        );
    };

    const GenerarDescripcionCompras = ({compra, checked, onToggle}) => {

        return (
            <div className={'flex items-center gap-2'}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(compra.id)}
                    className={'rounded-1 w-4 h-4'}
                />
                <b>{compra.proveedor?.nombre}</b> - ({compra.sucursal?.nombre + ')' ?? 'n/a'}
            </div>
        );
    };

    console.log('compras', compras);
    const data = compras?.map((compra) => {

        return {
            key: compra.id,
            className: '',
            content: [
                {
                    content: <>
                        {tipo ==='impuestos_en_cobros' &&
                            (<GenerarDescripcionImpuestosEnCobros
                            compra={compra}
                            checked={selectedIds.has(compra.id)}
                            onToggle={toggleCompra}
                        />)}
                        {tipo ==='gasto_general' &&
                            (<GenerarDescripcionGastosGenerales
                                compra={compra}
                                checked={selectedIds.has(compra.id)}
                                onToggle={toggleCompra}
                            />)}

                        {tipo ==='compras' &&
                            (<GenerarDescripcionCompras
                                compra={compra}
                                checked={selectedIds.has(compra.id)}
                                onToggle={toggleCompra}
                            />)}
                    </>,
                },
                {content: processDate(moment(compra.fechahora)), className: 'text-right pr-10'},
                {content: processNumber(compra.totalfactura, 2, false, '$'), className: 'text-right pr-10'}
            ]
        };
    }) ?? [];

    return <>
        <Table
            top={<div className={'text-center mt-4 font-bold italic'}>{titulo}</div>}
            className={'mt-5 max-h-[calc(500px)]'}
            isLoading={false}
            destacarColumnasPares
            header={header}
            data={data}
            emptyText={'No se encontraron Compras'}
        />

        {selectedIds.size > 0 && (
            <div className={'sticky bottom-0 z-10 mt-4 w-full bg-gray-300 p-3 font-bold flex justify-between items-center rounded shadow-md'}>
                <div>Total seleccionado</div>
                <div>{processNumber(totalSeleccionado, 2, false, '$')}</div>
            </div>
        )}
    </>;
};
