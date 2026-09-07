import React from 'react';

import {processDate} from "@/utils/dates.jsx";
import moment from "moment";
import {processNumber} from "@/utils/numbers.jsx";
import {Card} from "@/components/Card.jsx";
import {ChipBlue, ChipGreen, ChipRed} from "@/components/Chip.jsx";
import {Hr} from "@/components/Hr.jsx";

export const TransferenciasStock = ({transferencia}) => {

    if (!transferencia) return null;

    const cantidadTotal = (transferencia.detalles ?? []).reduce(
        (acc, detalle) => acc + Number(detalle?.cantidad ?? 0),
        0
    );
    const descripcionEstado = transferencia?.estado?.descripcion ?? transferencia?.descripcion_estado;


    const usuarioReceptor = transferencia?.firmas?.reduce((acum, value) => {

        if(value.rol === "RECEPTOR")
        {
            return value.usuario;
        }
        return acum;
    }, null);
    console.log('transferencia?.firmas', transferencia?.firmas, usuarioReceptor);
    return (
        <Card childrenClassName={'pt-0'}>
            <div className={'flex justify-between w-full  text-xl'}>
                    <div>
                        <span className={'font-bold'}> TRANSFERENCIA DE STOCK </span><br/>
                        <div className={'text-xs'}> ({transferencia?.motivo?.nombre ?? transferencia?.motivo?.descripcion})</div>
                    </div>
                    <div>{processDate(moment(transferencia.fechahora), false)}</div>
            </div>
                <Hr/>
            <div className={'grid grid-cols-6 mt-4'}>
                <div className={'col-span-4 grid grid-cols-2'}>
                    <div className={"font-bold uppercase text-slate-500 text-xxs dark:text-slate-500 "}>Origen:</div>
                    <div className={"font-bold uppercase text-slate-500 text-xxs dark:text-slate-500 "}>Destino:</div>
                    <div>
                        <b>{transferencia?.usuario?.nombre_completo}</b>
                        <div className={'text-xs'}>({transferencia?.sucursal_origen?.nombre})</div>
                    </div>
                    <div>
                        <b>{usuarioReceptor?.nombre_completo}</b>
                        <div className={'text-xs'}>({transferencia?.sucursal_destino?.nombre})</div>
                    </div>
                </div>

                <div className={'col-span-2 text-right text-xl'}>
                    {processNumber(cantidadTotal, 0, false, '#')}
                    {transferencia.idestado === 1 && <ChipBlue className={'ml-auto mt-3'}>{descripcionEstado}</ChipBlue>}
                    {transferencia.idestado === 2 && <ChipGreen className={'ml-auto mt-3'}>{descripcionEstado}</ChipGreen>}
                    {transferencia.idestado === 3 && <ChipRed className={'ml-auto mt-3'}>{descripcionEstado}</ChipRed>}
                </div>

            </div>
        </Card>
    );

}
