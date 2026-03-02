import React, {useEffect, useState} from 'react';
import {H3, PageHeader} from "@/components/H.jsx";
import {useAgrupacionCaja} from "@/dataHooks/useAgrupacionCaja.jsx";
import {useUltimaCaja} from "@/dataHooks/useCaja.jsx";
import {Label} from "@/components/Label.jsx";
import {esPar, processNumber} from "@/utils/numbers.jsx";
import moment from "moment";
import _ from "lodash";
import {processDate} from "@/utils/dates.jsx";
import {useConfigValue} from "@/dataHooks/useConfigValue.jsx";
import {Card} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleArrowDown, faCircleArrowUp} from "@fortawesome/free-solid-svg-icons";

const LocalLabel = ({className, children}) => <Label className={'text-gray-400 mr-2 ' + className}>{children}</Label>
const orderDirection = {
    DESC: 'desc',
    ASC: 'asc',
}
const OrderColumn = ({fieldName, setOrder}) => {
    const [direction, setDirection] = useState(orderDirection.ASC);

    const icon = direction === orderDirection.DESC ? faCircleArrowUp : faCircleArrowDown;

    const onClick = () => {
        setDirection(direction === orderDirection.DESC ? orderDirection.ASC : orderDirection.DESC);
        setOrder({
            field: fieldName,
            direction: direction,
        });
    }
    return <FontAwesomeIcon onClick={onClick} className={' cursor-pointer text-md ml-4'} icon={icon}/>;
}
const Encabezado = ({children, setOrder, fieldName, className}) => {
    return <LocalLabel className={className}>
        {children}
        <OrderColumn fieldName={fieldName} setOrder={setOrder}/>
    </LocalLabel>;
}
const UltimaCaja = ({usuarioId, sucursalId, key}) => {

    const [totalCaja, setTotalCaja] = useState(0);
    const {data: ultimaCaja, isLoading} = useUltimaCaja(usuarioId, sucursalId);
    const [order, setOrder] = useState({field: 'fechaHora', direction: orderDirection.DESC});

    return (ultimaCaja &&
        <div key={key} className={' border-b  mb-2'}>
            <div className={'bg-gray-400 rounded-md p-2 text-gray-800 text-lg'}>
                <div className={'flex  '}>
                    <div>{ultimaCaja.sucursal.nombre} / {ultimaCaja.usuario.nombre}</div>
                    <div className={'ml-auto'}>${processNumber(totalCaja)}</div>
                </div>
            </div>
            <div className={'grid grid-cols-6 gap-2 p-2mb-2 text-xs p-4'}>
                <div><LocalLabel>Caja inicial:</LocalLabel> ${processNumber(ultimaCaja.cajainicial)}</div>
                <div><LocalLabel>Apertura:</LocalLabel> {processDate(moment(ultimaCaja.cajainicial))}</div>
                <div><LocalLabel>Estado:</LocalLabel> {ultimaCaja.idestado === 1 ? 'Cerrada' : 'Abierta'}</div>
            </div>
            <div className={'grid grid-cols-6 gap-2 p-2mb-2 text-xs p-4'}>
                <Encabezado className={'col-span-3'} fieldName={'descripcion'} setOrder={setOrder}>Descripcion</Encabezado>
                <Encabezado fieldName={'tipo'} setOrder={setOrder}>Tipo</Encabezado>
                <Encabezado className={'text-right pr-4'} fieldName={'fechaHora'} setOrder={setOrder}>Fecha / Hora</Encabezado>
                <Encabezado className={'text-right pr-4'} fieldName={'importe'} setOrder={setOrder}>Importe</Encabezado>
                <DetalleCaja ultimaCaja={ultimaCaja} setTotalCaja={setTotalCaja} order={order}/>
            </div>
        </div>
    );
}

const DetalleCaja = ({ultimaCaja, setTotalCaja, order}) => {

    //config('medios_de_cobro.drivers.MercadoPagoQR.gastos.proveedorId')

    const {data: proveedorMercadoPagoId} = useConfigValue({key: 'medios_de_cobro.drivers.MercadoPagoQR.gastos.proveedorId'});
    const compras = ultimaCaja?.compras.map((compra) => ({
        id: 'cmp' + compra.id,
        descripcion: compra.observaciones ?? compra?.proveedor?.nombre ?? ' Compra',
        tipo: proveedorMercadoPagoId === compra?.proveedor?.id ? 'Mercado Pago Fee' : 'Compra',
        fechaHora: moment(compra.fechacreacion),
        importe: compra.totalfactura * -1,
        className: compra.totalfactura < 0 ? ' text-white !bg-red-500 ' : '',
    }));


    const getFechaHoraEstadoMovimiento = (movimiento) => {

        const last = (movimiento?.estados?.length ?? 0) - 1;

        if (last < 0) {
            return '';
        }
        return last ? moment(movimiento?.estados[last].fechahoraestado) : moment(movimiento.fechahoramovimiento);
    }
    const {data: proveedorMercadoMotivoId} = useConfigValue({key: 'medios_de_cobro.drivers.MercadoPagoQR.id_motivo_movimiento_caja'});

    const movimientosCaja = ultimaCaja?.movimientos_caja.map((movimiento) => ({
        id: 'movout' + movimiento.id,
        descripcion: <>Enviado
            por: <b>{movimiento.usuario_destino?.nombre + ' ' + movimiento.usuario_destino?.apellido}</b> </>,
        tipo: proveedorMercadoMotivoId === movimiento.motivo.id ? 'Mercado Pago' : 'Movimiento Salida',
        fechaHora: getFechaHoraEstadoMovimiento(movimiento),
        importe: movimiento.importe * 1,
        className: ' ',
    }));

    const movimientosCajaDestinatario = ultimaCaja?.movimientos_caja_destinatario.map((movimiento) => ({
        id: 'movin' + movimiento.id,
        descripcion: <>Devuelto a: <b>{movimiento.usuario?.nombre + ' ' + movimiento.usuario?.apellido}</b> </>,
        tipo: proveedorMercadoMotivoId === movimiento.motivo.id ? 'Mercado Pago: Reembolso' : 'Movimiento Entrada',
        fechaHora: getFechaHoraEstadoMovimiento(movimiento),
        importe: movimiento.importe * -1,
        className: ' text-white !bg-red-500 ',
    }));

    const generalArray = _.union(movimientosCaja, compras, movimientosCajaDestinatario);
    //const [ordenado, setOrdenado] = useState(_.orderBy(generalArray, [order.fieldName], [order.direction]));
    const [ordenado, setOrdenado] = useState([]);

    useEffect(() => {
        setTotalCaja(ordenado.reduce((acum, item) => (acum + item.importe), 0));
    }, [ordenado]);

    useEffect(() => {
        setOrdenado(_.orderBy(generalArray, [order.field], [order.direction]));
    }, [order]);

    return <>{ordenado.map((item, index) => (
        <div className={'col-span-6 grid grid-cols-6 p-1 ' + (esPar(index) ? ' bg-[#283030] ' : '') + item?.className}>
            <div className={'col-span-3 '} key={'c1:' + item.id}>{item.descripcion}</div>
            <div key={'c2:' + item.id}>{item.tipo}</div>
            <div className={'text-right pr-4 '}
                 key={'c3:' + item.id}>{item.fechaHora ? processDate(item.fechaHora) : 'No determinado'}</div>
            <div className={'text-right pr-4 '}
                 key={'c4:' + item.id}>${processNumber(item.importe)}</div>
        </div>
    ))}</>;
}

const Cabecera = ({agrupacionCaja}) => {
    return (
        <div className={'grid grid-cols-4 gap-4 p-4'}>
            <div><LocalLabel>Importe inicial:</LocalLabel></div>
            <div>${processNumber(agrupacionCaja.importeinicial, 2)}</div>

            <div><LocalLabel>Total agrupacion:</LocalLabel></div>
            <div>${processNumber(agrupacionCaja.importeinicial, 2)}</div>
        </div>
    );
}

export const AgrupacionCaja = ({agrupacionCajaId, onBack}) => {

    const {data: agrupacionCaja, isRefetching, isLoading, refetch} = useAgrupacionCaja(agrupacionCajaId, ['cajas']);

    return <>
        <PageHeader
            onBack={onBack}
            loading={isLoading || isRefetching}
            onRefresh={refetch}
        >
            Agrupacion de cajas / {agrupacionCaja?.descripcion}
        </PageHeader>

        {agrupacionCaja && <Cabecera agrupacionCaja={agrupacionCaja}/>}

        {agrupacionCaja && agrupacionCaja.cajas.map((caja) => <UltimaCaja key={caja.idusuario + '-' + caja.idsucursal}
                                                                          usuarioId={caja.idusuario}
                                                                          sucursalId={caja.idsucursal}/>)}
    </>
}
