import React from 'react';
import {useCaja} from "@/dataHooks/useCajas.jsx";
import {Loading} from "@/components/Loading.jsx";

import {CajaWidget} from "@/widgets/CajaDetalle/CajaWidget.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {processNumber} from "@/utils/numbers.jsx";
import {GeneraItemContainer} from "@/widgets/CajaDetalle/CajaUtils.jsx";
export const CajaMovimientos = ({caja, onClick}) => {

    const movimientos = [
        ...(caja.movimientos_caja ?? []),
        ...(caja.movimientos_caja_destinatario ?? []),
    ];

    const movimientosPorMotivo = Object.values(
        movimientos.reduce((acc, movimiento) => {
            const motivoId = movimiento.motivo.id;
            if (!acc[motivoId]) {
                acc[motivoId] = {motivo: movimiento.motivo, movimientos: []};
            }
            acc[motivoId].movimientos.push(movimiento);
            return acc;
        }, {})
    ).map((entry) => ({
        ...entry,
        movimientos: [...entry.movimientos].sort(
            (a, b) => new Date(b.fechahoramovimiento) - new Date(a.fechahoramovimiento)
        ),
    }));

    return (
        <>
            {movimientosPorMotivo.map(({motivo, movimientos: movimientosDelMotivo}) => {
                const total = movimientosDelMotivo.reduce((sum, m) => sum + ((m.usuario.id === caja.usuario.id ? -1 : 1) * parseFloat(m.importe)), 0);
                return (
                    <GeneraItemContainer className={''} key={motivo.id} onClick={() => onClick('movimientos', motivo.descripcion, movimientosDelMotivo)} importe={total} descripcion={motivo.descripcion} />
                );
            })}
        </>
    );

}
