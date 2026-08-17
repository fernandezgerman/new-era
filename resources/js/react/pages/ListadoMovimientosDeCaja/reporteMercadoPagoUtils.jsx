import moment from 'moment';
import {processDate} from '@/utils/dates.jsx';
import {processNumber} from '@/utils/numbers.jsx';
import {ChipBlue, ChipGreen, ChipOrange, ChipRed, ChipYellow} from "@/components/Chip.jsx";
import {IconButton, ViewIconButton} from "@/components/Buttons.jsx";
import {faMagnifyingGlass, faXmark} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const toYmdHis = (date) => {
    if (!date) {
        return null;
    }
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

export const validateReporteMercadoPagoFilters = ({
    sucursal,
    fechaHoraDesde,
    fechaHoraHasta,
} = {}) => {
    const fieldErrors = {};

    if (!sucursal?.id) {
        fieldErrors.sucursal = 'Seleccione una sucursal.';
    }
    if (!fechaHoraDesde) {
        fieldErrors.fechaHoraDesde = 'Seleccione fecha hora desde.';
    }
    if (!fechaHoraHasta) {
        fieldErrors.fechaHoraHasta = 'Seleccione fecha hora hasta.';
    }
    if (
        fechaHoraDesde
        && fechaHoraHasta
        && !moment(fechaHoraHasta).isAfter(moment(fechaHoraDesde))
    ) {
        fieldErrors.fechaHoraHasta = 'La fecha hora hasta debe ser mayor a la fecha hora desde.';
    }

    return {
        isValid: Object.keys(fieldErrors).length === 0,
        fieldErrors,
    };
};

export const buildReporteMercadoPagoPayload = ({
    sucursal,
    fechaHoraDesde,
    fechaHoraHasta,
} = {}) => ({
    sucursal_id: parseInt(sucursal?.id, 10),
    fecha_hora_desde: toYmdHis(fechaHoraDesde),
    fecha_hora_hasta: toYmdHis(fechaHoraHasta),
});

const TIPO_LABELS = {
    movimiento: 'Movimiento',
    compra: 'Compra',
};

export const formatReporteMercadoPagoTipo = (tipo) => {
    if (tipo == null || tipo === '') {
        return '—';
    }
    return TIPO_LABELS[tipo] ?? String(tipo);
};

export const getReporteMercadoPagoFechaHora = (item) => (
    item?.fechahoramovimiento ?? item?.fechahora ?? null
);

export const REPORTE_MERCADO_PAGO_TABLE_HEADER = [
    {name: '#', className: 'text-left'},
    {name: 'Vendedor', className: 'text-left'},
    {name: 'Tipo', className: 'text-left'},
    {name: 'Pago Id', className: 'text-left'},
    {name: 'Orden Id', className: 'text-left'},
    {name: 'Fecha / Hora', className: 'text-left'},
    {name: 'GST', className: 'text-right'},
    {name: 'Importe', className: 'text-right'},
];

const getItemImporte = (item) => Number(item?.importe) || 0;

const getCompraImporte = (item) => Number(item?.cimporte ?? item?.importe) || 0;

const compareByFechaHora = (a, b) => {
    const fechaA = getReporteMercadoPagoFechaHora(a);
    const fechaB = getReporteMercadoPagoFechaHora(b);
    const timeA = fechaA ? moment(fechaA).valueOf() : 0;
    const timeB = fechaB ? moment(fechaB).valueOf() : 0;
    const dif = timeA - timeB;
    const secondCriteria = (a.tipo === 'movimiento' ? -1 : 1);
    return timeA === timeB ? secondCriteria : dif;
};

/**
 * Orders by fechahora, then merges each movimiento with the compras that follow
 * until the next movimiento. Importe = movimiento.importe - sum(compras.importe).
 */
export const mergeReporteMercadoPagoItems = (items = []) => {

    const sorted = [...(items ?? [])].sort(compareByFechaHora);
    const merged = [];

    for (let i = 0; i < sorted.length; i++) {
        const item = sorted[i];
        if (item?.tipo !== 'movimiento') {
            continue;
        }

        const compras = [];
        let j = i + 1;
        while (j < sorted.length && sorted[j]?.tipo !== 'movimiento') {
            if (sorted[j]?.tipo === 'compra') {
                compras.push(sorted[j]);
            }
            j += 1;
        }

        const comprasImporte = compras.reduce(
            (sum, compra) => sum + getCompraImporte(compra),
            0,
        );

        merged.push({
            ...item,
            compras,
            importe: getItemImporte(item) - comprasImporte,
            totalCompras: compras?.length ?? 0,
        });
    }

    return merged;
};

const OrdenId = ({item}) => {

    if(item?.info?.venta_sucursal_cobro?.mercado_pago_orders ){
        return item?.info?.venta_sucursal_cobro?.mercado_pago_orders[0].externalorderid;
    }
    return '??';
}
const PaymentId = ({item}) => {

    if(item?.info?.venta_sucursal_cobro?.mercado_pago_orders && item?.info?.venta_sucursal_cobro?.mercado_pago_orders[0].payments){
        return item?.info?.venta_sucursal_cobro?.mercado_pago_orders[0].payments[0]?.externalpaymentid;
    }
    return '??';
}

const TotalGasto = ({item}) => {
    const totalGasto = getTotalGastos(item);

    const className = (totalGasto > (item?.importe * (0.2))) ? 'text-red-600 font- bold ' : '';
    return <span className={className}>{processNumber(Number(getTotalGastos(item)) || 0, 2, false, '$')}</span>;
}
const getTotalGastos = (item) => {

    if(item?.info?.venta_sucursal_cobro?.cobro_sucursal_gastos && item?.info?.venta_sucursal_cobro?.cobro_sucursal_gastos[0]?.gasto){
        return item?.info?.venta_sucursal_cobro?.cobro_sucursal_gastos[0]?.gasto?.totalfactura ?? 0;
    }
    return 0;
}
const TipoDeVentaCobro = ({item}) => {

    const descripcion = item?.info?.venta_sucursal_cobro?.tipo ?? '??';
    if(item?.info?.venta_sucursal_cobro?.tipo === 'QR'){
        return <ChipYellow >{descripcion}</ChipYellow>;
    }
    if(item?.info?.venta_sucursal_cobro?.tipo === 'No determinado'){
        return <ChipRed>{descripcion}</ChipRed>;
    }
    return <ChipOrange >{descripcion}</ChipOrange>;
}
export const getReporteMercadoPagoTotal = (items = []) =>
    items.reduce(
        (sum, item) => sum + ((Number(item?.importe) - getTotalGastos(item)) || 0),
        0,
    );

export const buildReporteMercadoPagoTableRows = (items = []) =>
    items.map((item, index) => {
        const fechaHora = getReporteMercadoPagoFechaHora(item);

        return {
            key: `${item?.tipo ?? 'row'}-${item?.id ?? index}`,
            content: [
                {
                    content: <div className={'flex'}><IconButton
                        icon={faMagnifyingGlass}
                        iconClassName={'text-xxs'}
                        className={'flex p-0.5 py-1.5!'}
                    />{'#' + (index + 1)} </div>,
                    className: 'text-left'
                },
                {
                    content: <ChipBlue>{item?.info?.venta_sucursal_cobro?.usuario?.nombre_completo ?? '??'}</ChipBlue>,
                    className: 'text-left'
                },
                {
                    content: <TipoDeVentaCobro item={item} />,
                    className: 'text-left'
                },
                {
                    content: <PaymentId item={item} />,
                    className: 'text-left',
                },
                {
                    content: <OrdenId item={item} />,
                    className: 'text-left',
                },
                {
                    content: fechaHora
                        ? processDate(moment(fechaHora), false, true)
                        : '—',
                    className: 'text-left',
                },
                {
                    content: <TotalGasto item={item} />,
                    className: 'text-right',
                },
                {
                    content: <b>{processNumber(Number(item?.importe - getTotalGastos(item)) || 0, 2, false, '$')}</b>,
                    className: 'text-right',
                },
            ],
        };
    });
