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
import {faCircleArrowDown, faCircleArrowUp, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {IconButton} from "@/components/Buttons.jsx";
import {Loading} from "@/components/Loading.jsx";
import {DivCenterContentHyV} from "@/components/Containers/DivCenterContentHyV.jsx";
import useSystemTheme from "@/utils/useSystemTheme.jsx";

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
const UltimaCaja = ({usuarioId, sucursalId, key, setTotalLoaded = (usuarioid, sucursalid, importe) => {}}) => {

    const [totalCaja, setTotalCaja] = useState(0);
    const [detalleVisible, setDetalleVisible] = useState(false);
    const {data: ultimaCaja, isLoading, refetch} = useUltimaCaja(usuarioId, sucursalId);
    const [order, setOrder] = useState({field: 'fechaHora', direction: orderDirection.DESC});

    useEffect(() => {
        setTotalLoaded(sucursalId, usuarioId, totalCaja);
        console.log(sucursalId, usuarioId, totalCaja);
    }, [totalCaja]);

    return <>
        {!ultimaCaja && (
            <div key={'loading' + key} className={' border-b  mb-2'}>
                <div className={'bg-gray-400 rounded-md p-2 text-gray-800 text-md'}>
                    <div className={'flex  '}>
                        <DivCenterContentHyV className={'w-full h-[20px]!'}> <Loading/></DivCenterContentHyV>
                    </div>
                </div>
            </div>)}
        {ultimaCaja &&
            (<>
                <div key={key} className={' border-b  mb-2'}>
                    <div className={'bg-gray-400 rounded-md p-2 text-gray-800 text-md'}>
                        <div className={'flex  '}>
                            <div><IconButton onClick={() => setDetalleVisible(!detalleVisible)}
                                             icon={detalleVisible ? faMinus : faPlus}/> {ultimaCaja.sucursal.nombre} / {ultimaCaja.usuario.nombre}
                            </div>
                            <div className={'ml-auto'}>${processNumber(totalCaja)}</div>
                        </div>
                    </div>

                    <div className={detalleVisible ? '' : ' hidden '}>
                        <div className={'grid grid-cols-4 gap-2 p-2mb-2 text-xs p-4'}>
                            <div><LocalLabel>Caja inicial:</LocalLabel> ${processNumber(ultimaCaja.cajainicial)}
                            </div>
                            <div><LocalLabel>Apertura:</LocalLabel> {processDate(moment(ultimaCaja.fechaapertura))}
                            </div>
                            <div>
                                <LocalLabel>Estado:</LocalLabel> {ultimaCaja.idestado === 1 ? 'Cerrada' : 'Abierta'}
                            </div>
                        </div>
                        <div className={'grid grid-cols-6 gap-2 p-2mb-2 text-xs p-4'}>
                            <Encabezado className={'col-span-3'} fieldName={'descripcion'}
                                        setOrder={setOrder}>Descripcion</Encabezado>
                            <Encabezado fieldName={'tipo'} setOrder={setOrder}>Tipo</Encabezado>
                            <Encabezado className={'text-right pr-4'} fieldName={'fechaHora'} setOrder={setOrder}>Fecha</Encabezado>
                            <Encabezado className={'text-right pr-4'} fieldName={'importe'}
                                        setOrder={setOrder}>Importe</Encabezado>
                            <DetalleCaja ultimaCaja={ultimaCaja} setTotalCaja={setTotalCaja} order={order}/>
                        </div>
                    </div>
                </div>
            </>)
        }
    </>;
}

const DetalleCaja = ({ultimaCaja, setTotalCaja, order}) => {

    const darkMode = useSystemTheme();
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
            a: <b>{movimiento.usuario_destino?.nombre + ' ' + movimiento.usuario_destino?.apellido}</b> </>,
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
        setTotalCaja(ordenado.reduce((acum, item) => (acum + item.importe), 0) + parseFloat(ultimaCaja.cajainicial ?? 0) );
    }, [ordenado]);

    useEffect(() => {
        setOrdenado(_.orderBy(generalArray, [order.field], [order.direction]));
    }, [order]);

    const bgPar = darkMode ? 'bg-[#283030]' : ' bg-gray-200 ';

    return <>{ordenado.map((item, index) => (
        <div className={'col-span-6 grid grid-cols-6 p-1 ' + (esPar(index) ? bgPar + '' : '') /*+ item?.className*/}>
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
            <div><LocalLabel>Usuarios habilitados:</LocalLabel></div>
            <div
                className={'col-span-3'}>{agrupacionCaja.usuarios.reduce((acum, user) => acum + (acum === '' ? '' : ', ') + user.usuario.nombre + ' ' + user.usuario.apellido, '')}</div>
        </div>
    );
}

export const AgrupacionCaja = ({agrupacionCajaId, onBack}) => {

    const [totalCajas, setTotalCajas] = useState({});

    const {
        data: agrupacionCaja,
        isRefetching,
        isLoading,
        refetch
    } = useAgrupacionCaja(agrupacionCajaId, ['cajas', 'usuarios.usuario']);

    const loading = isLoading || isRefetching;


    const setTotalLoaded = (idsucursal, idusuario, importe) => {
        setTotalCajas({...totalCajas,[idsucursal + '-' + idusuario]: importe});
    }

    const totalLoadedCalculado = Object.values(totalCajas).reduce((acc, val) => acc + val, 0) + (agrupacionCaja?.importeinicial ?? 0);

    return <>
        <PageHeader
            onBack={onBack}
            loading={loading}
            onRefresh={refetch}
        >
            Agrupacion de cajas / {agrupacionCaja?.descripcion}
        </PageHeader>

        {(loading || !agrupacionCaja) &&
            <DivCenterContentHyV className={'w-full h-[50%]!'}> <Loading/></DivCenterContentHyV>}

        {!loading && agrupacionCaja && <>
            <Cabecera agrupacionCaja={agrupacionCaja}/>

            <div className={'bg-pink-400 rounded-md p-2 text-pink-800 text-lg bold mb-2'}>
                <div className={'flex  '}>
                    <div className={'ml-8'}>TOTAL {agrupacionCaja?.descripcion}</div>
                    <div className={'ml-auto'}>${processNumber(totalLoadedCalculado)}</div>
                </div>
            </div>

            <div className={'px-4'}>
                <div className={'bg-gray-400 rounded-md p-2 text-gray-800 text-md mb-2'}>
                    <div className={'flex  '}>
                        <div className={'ml-9'}>Importe inicial</div>
                        <div className={'ml-auto'}>${processNumber(agrupacionCaja.importeinicial, 2)}</div>
                    </div>
                </div>
                {agrupacionCaja && agrupacionCaja.cajas.map((caja) => <UltimaCaja
                    setTotalLoaded={setTotalLoaded}
                    key={caja.idusuario + '-' + caja.idsucursal}
                    usuarioId={caja.idusuario}
                    sucursalId={caja.idsucursal}/>)}
            </div>
        </>
        }
    </>
}
