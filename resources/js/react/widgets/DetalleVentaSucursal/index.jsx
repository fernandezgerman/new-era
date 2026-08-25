import React, {useEffect, useState} from 'react';
import {CustomModal} from "@/components/Modal.jsx";
import {useVentaSucursal} from "@/dataHooks/useVentaSucursal.jsx";
import {Usuario} from "@/components/Usuario.jsx";
import {Sucursal} from "@/components/Sucursal.jsx";
import {H1, H2, H3} from "@/components/H.jsx";
import {Hr} from "@/components/Hr.jsx";
import {ChipBlue, ChipGreen, ChipOrange, ChipRed, ChipYellow} from "@/components/Chip.jsx";
import {processDate} from "@/utils/dates.jsx";
import moment from "moment";
import {processNumber} from "@/utils/numbers.jsx";
import {camelCaseToSpace, snakeCaseToSpace} from "@/utils/general.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeftLong, faArrowRight,
    faArrowRightLong,
    faArrowsV, faEquals,
    faMagnifyingGlass, faPlus,
    faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import {ViewIconButton} from "@/components/Buttons.jsx";


const Label = ({children, className}) => <div className={'text-xxs mb-[-5px] '+className}>{children}</div>;

const ShowNumbers = ({precioCosto, precioVenta, compraDetalle, cantidad}) => {
    const ganancia = precioVenta - precioCosto;
    const porcentajeGanancia = ganancia !== 0 ? (ganancia / precioCosto) * 100 : 0;
    const rentabilidad = ganancia !== 0 ? (ganancia / precioVenta) * 100 : 0;

    return <div className={'grid grid-cols-3 gap-10 mt-4  place-items-center'}>
        <div>
            <Label>Ganancia Total (x{parseInt(cantidad)}): </Label>
            <span className={'font-bold'}>{processNumber(ganancia, '2', false, '$')}</span>
        </div>
        <div>
            <Label>Rentabilidad %:</Label>
            <span className={'font-bold'}>{processNumber(rentabilidad, '2', false, '')}%</span>
        </div>
        <div>
            <Label>Ganancia %:</Label>
            <span className={'font-bold'}>{processNumber(porcentajeGanancia, '2', false, '')}%</span>
        </div>
        <div className={'col-span-3 flex'}>
            {/*<Label>Costo Sin impuestos:</Label>
            <span className={'font-bold'}>{processNumber(compraDetalle.precio, '2', false, '$')}</span>
        </div>
        <div>
            <Label>Total impuestos:</Label>
            <span className={'font-bold'}>{processNumber(precioCosto - compraDetalle.precio, '2', false, '$')}</span>
        </div>
        <div>*/}
            <div>
                <Label>Costo bruto </Label>
                <span >{processNumber(compraDetalle.precio, '2', false, '$')}</span>
            </div>
            <FontAwesomeIcon className={'mt-3.5 mx-2'} icon={faPlus}/>
            <div>
                <Label>Impuestos: </Label>
                <span >{processNumber(precioCosto - compraDetalle.precio, '2', false, '$')}</span>
            </div>
            <FontAwesomeIcon className={'mt-4 mx-2'} icon={faEquals}/>
            <div>
                <Label>Costo final </Label>
                <span className={'font-bold text-xl'}>{processNumber(precioCosto, '2', false, '$')}</span>
            </div>
        </div>
    </div>;
}


const ShowNumbers2 = ({precioCosto, precioVenta, compraDetalle, cantidad, ventaSucursal}) => {
    const ganancia = precioVenta - precioCosto;
    const porcentajeGanancia = ganancia !== 0 ? (ganancia / precioCosto) * 100 : 0;
    const rentabilidad = ganancia !== 0 ? (ganancia / precioVenta) * 100 : 0;

    const criterio  = ventaSucursal.costosucursalcriterio;
    return <div className={'grid grid-cols-5  mt-4 place-items-right '}>
        <div className={' col-span-3 text-right mt-2.5'}>
            Costo unitario:
        </div>
        <div className={'flex col-span-2 justify-end'}>
            <div>
                <Label>Costo bruto </Label>
                <span >{processNumber(compraDetalle.precio, '2', false, '$')}</span>
            </div>
            <FontAwesomeIcon className={'mt-3.5 mx-2'} icon={faPlus}/>
            <div>
                <Label>Impuestos: </Label>
                <span >{processNumber(precioCosto - compraDetalle.precio, '2', false, '$')}</span>
            </div>
            <FontAwesomeIcon className={'mt-4 mx-2'} icon={faEquals}/>
            <div>
                <Label>Costo final </Label>
                <span className={'font-bold'}>{processNumber(precioCosto, '2', false, '$')}</span>
            </div>
        </div>

        <div className={' col-span-3 text-right mt-2.5'}>
            Ganancia total:
        </div>
        <div className={'text-right col-span-2'}>
            <Label>Venta - Costo (x{parseInt(cantidad)}): </Label>
            <span className={'font-bold'}>{processNumber(ganancia, '2', false, '$')}</span>
        </div>

        <div className={' col-span-3 text-right mt-2.5'}>
            Ganancia %:
        </div>
        <div className={' text-right col-span-2'}>
            <Label>Ganancia %:</Label>
            <span className={'font-bold'}>{processNumber(porcentajeGanancia, '2', false, '')}%</span>
        </div>

        <div className={' col-span-3 text-right mt-2.5'}>
            Rentabilidad:
        </div>
        <div className={' text-right col-span-2'}>
            <Label>(Ganancia / Precio Venta) x 100</Label>
            <span className={'font-bold'}>{processNumber(rentabilidad, '2', false, '')}%</span>
        </div>
    </div>;
}
const ShowCompraDetails = ({compraDetalle}) => {

    const handleClick = () => {
        window.open('principal.php?pagina=prmteditfaccmp&idCompra='+compraDetalle.compra.id, "_blank", "width=1000,height=1200");
    };

    return (<>
        <div className={'grid grid-cols-3 gap-2  mt-4'}>
            <div>
                <Label>Proveedor:</Label>
                <span className={'font-bold'}>{compraDetalle.compra.proveedor?.nombre}</span>
            </div>
            <div>
                <Label>Compra num:</Label>

                <ViewIconButton onClick={handleClick} className={'text-xxs'} />
                <span className={'font-bold p-0.5'}> #{compraDetalle.compra.numero_comprobante}</span>


                {/*} <Label>Compra num:</Label>
                <a  href={'principal.php?pagina=prmteditfaccmp&idCompra='+compraDetalle.compra.id}
                    target={'_blank'}
                    className={" underline "}
                    aria-expanded="false">
                    <span className={'font-bold p-0.5'}><FontAwesomeIcon className={'text-xs'} icon={faMagnifyingGlass} /> #{compraDetalle.compra.numero_completo}</span>
                </a>
*/}
            </div>
            <div>
                <Label>Fecha:</Label>
                <span className={'font-bold'}>{processDate(moment(compraDetalle.compra.fechahora))}</span>
            </div>
        </div>
    </>);
}

const ShowDescuento = ({descuento}) => {
    return <>
        <ChipGreen>{descuento.tipo_descuento.nombre}</ChipGreen>
        <div className={'grid grid-cols-4 gap-2 mt-4'}>
            <div className={'col-span-3'}>
                <Label>Descuento <b>{descuento.tipo_descuento.nombre}</b>:</Label>
                {descuento.usuario_autorizo?.nombre_completo} - {descuento.motivo_descuento.nombre}
            </div>
            <div className={'text-right'}>
                <Label>Importe descuento</Label>
                {processNumber(descuento.valordescuento, 2, false, '$')}
            </div>
        </div>
    </>;
}

export const VerDetalleVentaSucursalModal = ({idVentaSucursal, setIdVentaSucursal, className}) => {
    const isOpen = idVentaSucursal !== null;

    const onAceptar = () => setIdVentaSucursal(null);

    const {data: ventaSucursal, isLoading} = useVentaSucursal({idVentaSucursal});

    if (!ventaSucursal) return '';

    const textCantidad = parseInt(ventaSucursal.cantidad) !== 1 ?
        <>({processNumber(ventaSucursal.cantidad, 0, false, '#') + ' x '} {processNumber(ventaSucursal.preciounitario, 2, false, '$')})</> : '';
    const CriterioComponent = ({criterio}) => {
        return <span className={'font-bold'}>{criterio ? snakeCaseToSpace(criterio) : 'N / A'}</span>
    }


    return (
        <CustomModal
            loading={isLoading}
            onAceptar={onAceptar}
            isOpen={isOpen}
            setIsOpen={onAceptar}
            widthEnPX={'l'}
            titulo={<H1>Resumen de venta</H1>}
            cancelButtonVisible={false}
        >
            {ventaSucursal && (
                <>
                    <H2>Datos de la venta</H2>
                    <div className={'grid grid-cols-2 gap-2'}>
                        <div>
                            <Label>Usuario:</Label>
                            <Usuario idusuario={ventaSucursal.idusuario} className={'font-bold'}/>
                        </div>
                        <div>
                            <Label>Sucursal:</Label>
                            <Sucursal idsucursal={ventaSucursal.idsucursal} className={'font-bold'}/>
                        </div>
                        <div>
                            <Label>Fecha / Hora:</Label><span
                            className={'font-bold'}> {processDate(moment(ventaSucursal.fechaenvio), false, true)}</span>
                        </div>
                        <div>
                            <Label>Lista</Label>{ventaSucursal.lista.id === 2 ?
                            <ChipBlue>{ventaSucursal.lista.nombre}</ChipBlue> :
                            <ChipYellow>{ventaSucursal.lista.nombre}</ChipYellow>}
                        </div>
                    </div>
                    <Hr/>
                    <div className={'grid grid-cols-3 gap-2 '}>
                        <div className={'col-span-2 mt-0.5'}>
                            <Label>Codigo - Articulo:</Label>
                            <span
                                className={'font-bold'}>{ventaSucursal.articulo.codigo} - {ventaSucursal.articulo.nombre}</span>
                        </div>
                        <div className={'text-right'}>
                            <Label>Precio {textCantidad}:</Label>
                            <span
                                className={'font-bold text-lg'}> {processNumber(ventaSucursal.preciounitario * ventaSucursal.cantidad, 2, false, '$')}</span>
                        </div>
                    </div>
                    {(ventaSucursal.descuentos ?? []).map((descuento) => <ShowDescuento descuento={descuento}/>)}
                    {(ventaSucursal.precios_temporales ?? []).map(() => <ChipOrange>Precio temporal</ChipOrange>)}
                    {ventaSucursal.promocion_venta && <ChipRed>{ventaSucursal.promocion_venta.promocion.descripcion} </ChipRed>}

                    <ShowNumbers2
                        ventaSucursal={ventaSucursal}
                        precioVenta={ventaSucursal.preciounitario}
                        precioCosto={ventaSucursal.extra.compra_detalle.costo_con_impuestos}
                        cantidad={ventaSucursal.cantidad}
                        compraDetalle={ventaSucursal.extra.compra_detalle}
                    />

                    <Hr/>
                    <H2>Datos del costo asociado</H2>
                    <div>
                        <Label>Criterio:</Label>
                        <CriterioComponent criterio={ventaSucursal.costosucursalcriterio}/>
                    </div>
                    {ventaSucursal.extra.compra_detalle &&
                        <ShowCompraDetails compraDetalle={ventaSucursal.extra.compra_detalle}/>}

                </>
            )}
        </CustomModal>

    )
}

