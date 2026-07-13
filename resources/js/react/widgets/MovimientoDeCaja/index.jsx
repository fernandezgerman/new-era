import React from 'react';

import {GeneraItemContainer} from "@/widgets/CajaDetalle/CajaUtils.jsx";
import {processDate} from "@/utils/dates.jsx";
import moment from "moment";
import {processNumber} from "@/utils/numbers.jsx";
import {Card} from "@/components/Card.jsx";
import {ChipBlue, ChipGreen, ChipRed} from "@/components/Chip.jsx";
import {Hr} from "@/components/Hr.jsx";
export const MovimientoDeCaja = ({movimiento}) => {

    if (!movimiento) return null;
    return (
        <Card childrenClassName={'pt-0'}>
            <div className={'flex justify-between w-full font-bold text-xl'}>
                <div>{movimiento?.motivo?.descripcion}</div>
                <div>{processDate(moment(movimiento.fechahoramovimiento), false)}</div>
            </div>
            <Hr/>
            <div className={'grid grid-cols-6 mt-4'}>
                <div className={'col-span-4 grid grid-cols-2'}>
                    <div className={"font-bold uppercase text-slate-500 text-xxs dark:text-slate-500 "}>Origen:</div>
                    <div className={"font-bold uppercase text-slate-500 text-xxs dark:text-slate-500 "}>Destino:</div>
                    <div>
                        <b>{movimiento?.usuario?.nombre_completo}</b>
                        <div className={'text-xs'}>({movimiento?.sucursal?.nombre})</div>
                    </div>
                    <div>
                        <b>{movimiento?.usuario_destino?.nombre_completo}</b>
                        <div className={'text-xs'}>({movimiento?.sucursal_destino?.nombre})</div>
                    </div>
                </div>

                <div className={'col-span-2 text-right text-xl'}>
                    {processNumber(movimiento.importe, 2,false, '$')}
                    {movimiento.idestado === 1 && <ChipBlue className={'ml-auto mt-3'}>{movimiento.descripcion_estado}</ChipBlue>}
                    {movimiento.idestado === 2 && <ChipGreen className={'ml-auto mt-3'}>{movimiento.descripcion_estado}</ChipGreen>}
                    {movimiento.idestado === 3 && <ChipRed className={'ml-auto mt-3'}>{movimiento.descripcion_estado}</ChipRed>}
                </div>

            </div>
        </Card>
    );

}
