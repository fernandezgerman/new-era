import React, {useMemo, useState} from 'react';
import {PageHeader} from "@/components/H.jsx";
import {processDate} from "@/utils/dates.jsx";
import moment from 'moment';
import {ChipBlue, ChipGreen, ChipRed} from "@/components/Chip.jsx";
import {useConfigValue} from "@/dataHooks/useConfigValue.jsx";
import {CajaMovimientos} from "@/widgets/CajaDetalle/CajaMovimientos.jsx";
import {CajaCompras} from "@/widgets/CajaDetalle/CajaCompras.jsx";
import {GeneraItemContainer, GeneraSubItemContainer} from "@/widgets/CajaDetalle/CajaUtils.jsx";
import {MostrarMovimientos} from "@/widgets/CajaDetalle/MovimientosDetalle.jsx";
import {MostrarCompra} from "@/widgets/CajaDetalle/ComprasDetalle.jsx";

const PaginaPrincipal = ({caja, onClick}) => {
    return (<>
        <GeneraItemContainer className={'bg-gray-300 font-bold'} importe={caja.cajainicial} descripcion={'Caja inicial'} />
        <CajaMovimientos onClick={onClick} caja={caja}/>
        <CajaCompras onClick={onClick} caja={caja}/>
    </>);
}


export const CajaWidget = ({caja, loading = false, refetch = null}) => {

    const [detalle, setDetalle] = useState(null);

    const clickEnDetalle = (tipo, descripcion, detalles) => {
        setDetalle({
            tipo,
            descripcion,
            detalles,
        });
    }

    const {data: gastoDeMercadoPagoId} = useConfigValue({key: 'medios_de_cobro.drivers.MercadoPagoQR.gastos.articuloId'});
    const esPaginaPrincipal = detalle === null;

    const headerText = caja.usuario.nombre_completo + ' #' + caja.numero + ' ';

    const onBack =esPaginaPrincipal ? null : () => setDetalle(null);

    return (<>
        <PageHeader onRefresh={refetch}  loading={loading} onBack={onBack}>{headerText} </PageHeader>
        <div className={'grid grid-cols-5 mt-6'}>
            <div> Sucursal:</div>
            <div className={'font-bold col-span-2'}>{caja.sucursal.nombre}</div>

            <div>Apertura:</div>
            <div className={'font-bold'}>{processDate(moment(caja.fechaapertura))}</div>

            <div>Estado:</div>
            <div className={'font-bold col-span-2'}>{caja.idestado === 0 ? <ChipBlue>Abierta</ChipBlue> : <ChipGreen>Cerrada</ChipGreen>}</div>

            <div>Cierre:</div>
            <div>{caja.idestado === 1 ? processDate(moment(caja.fechacierre)) : 'n/a'}</div>
        </div>

        {esPaginaPrincipal && (<PaginaPrincipal caja={caja} onClick={clickEnDetalle}/>)}
        {detalle?.tipo === 'movimientos' && <MostrarMovimientos movimientos={detalle.detalles} caja={caja} motivo={detalle.descripcion} />}
        {detalle?.tipo === 'impuestos_en_cobros' && <MostrarCompra titulo={detalle.descripcion} compras={detalle.detalles} caja={caja} tipo={detalle?.tipo} />}
        {detalle?.tipo === 'gasto_general' && <MostrarCompra titulo={detalle.descripcion} compras={detalle.detalles} caja={caja} tipo={detalle?.tipo} />}
        {detalle?.tipo === 'compras' && <MostrarCompra titulo={detalle.descripcion} compras={detalle.detalles} caja={caja} tipo={detalle?.tipo} />}

    </>);
}
