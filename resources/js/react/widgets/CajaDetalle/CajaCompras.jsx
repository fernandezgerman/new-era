import React from 'react';
import {useCaja} from "@/dataHooks/useCajas.jsx";
import {Loading} from "@/components/Loading.jsx";

import {CajaWidget} from "@/widgets/CajaDetalle/CajaWidget.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {processNumber} from "@/utils/numbers.jsx";
import {GeneraItemContainer} from "@/widgets/CajaDetalle/CajaUtils.jsx";

const snakeCaseToText = (value) => {
    const text = (value ?? '').replace(/_/g, ' ').trim();
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const CajaCompras = ({caja, onClick}) => {

    const compras = [...(caja.compras ?? [])];

    const comprasPorTipoDeSalida = Object.values(
        compras.reduce((acc, compra) => {
            const tipoDeSalida = compra.tipo_de_salida;
            if (!acc[tipoDeSalida]) {
                acc[tipoDeSalida] = {tipoDeSalida, compras: []};
            }
            acc[tipoDeSalida].compras.push(compra);
            return acc;
        }, {})
    ).map((entry) => ({
        ...entry,
        compras: [...entry.compras].sort(
            (a, b) => new Date(b.fechahora) - new Date(a.fechahora)
        ),
    }));

    return (
        <>
            {comprasPorTipoDeSalida.map(({tipoDeSalida, compras: comprasDelTipo}) => {
                const total = comprasDelTipo.reduce((sum, c) => sum + parseFloat(c.totalfactura), 0);
                return (
                    <GeneraItemContainer key={tipoDeSalida} onClick={() => onClick(tipoDeSalida, snakeCaseToText(tipoDeSalida), comprasDelTipo)} importe={total * -1} descripcion={snakeCaseToText(tipoDeSalida)} />
                );
            })}
        </>
    );

}
