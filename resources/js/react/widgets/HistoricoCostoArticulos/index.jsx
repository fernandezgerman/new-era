import React, {useEffect, useState} from 'react';
import {CustomModal} from "@/components/Modal.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import ArticulosHistoricoCostos from "@/resources/ArticulosHistoricoDeCostos.jsx";
import {Label, LabelAddNumberSign, LabelError} from "@/components/Label.jsx";
import {TimeLine} from "@/components/TimeLine.jsx";
import {TbFileInvoice} from "react-icons/tb";
import {HiCalendar} from "react-icons/hi";
import {processDate} from "@/utils/dates.jsx";
import moment from "moment";
import {MdCalculate, MdOutlinePriceChange, MdOutlineSystemUpdateAlt} from "react-icons/md";
import {RiAddCircleFill} from "react-icons/ri";
import {Chip} from "@/components/Chip.jsx";
import {map} from "lodash";
import {useArticulo} from "@/dataHooks/useArticulos.jsx";
import {PopOver} from "@/components/PopOver.jsx";


const mapMedioToDescription = (modo) => {
    switch (modo) {
        case 'COMPRA':
            return 'Compra';
        case 'RECALCULO':
            return 'Anulacion o Compra Dudosa';
        case 'CONF_PRECIOS':
            return 'Manualmente, desde listas de precios';
        case 'ARTICULOS UPDATE':
            return 'Modificacion de articulos';
        case 'ARTICULOS INSERT':
            return 'Alta un articulo';
        default:
            return modo;
    }
}

const mapMedioToIcon = (modo) => {
    switch (modo) {
        case 'COMPRA':
            return TbFileInvoice;
        case 'RECALCULO':
            return MdCalculate;
        case 'CONF_PRECIOS':
            return MdOutlinePriceChange;
        case 'ARTICULOS UPDATE':
            return MdOutlineSystemUpdateAlt;
        case 'ARTICULOS INSERT':
            return RiAddCircleFill;
        default:
            return HiCalendar;
    }
}

const ChipTag = ({tag, index}) => {

    const resolveColor = (index)=> {
        switch (index){
            case 'usuario':
                return ' bg-green-500 ';
            case 'sucursal':
                return ' bg-pink-500 ';
            case 'anulada':
                return ' bg-red-500 ';
            case 'dudosa':
                if(tag.audicionresultado === 3) return ' bg-yellow-200 text-black! ';
                if(tag.audicionresultado === 1) return ' bg-red-500 ';
                if(tag.audicionresultado === 2) return ' bg-blue-500 ';
                 return ' bg-gray-500 ';
            default:
                return ' bg-blue-500 ';
        }
    }

    const resolvePopoverTitle = () => {
        switch (index){
            case 'usuario':
                return tag
            case 'sucursal':
                return tag;
            case 'proveedor':
                return tag;
            case 'anulada':
                return 'Anulada el '+ processDate(moment(tag.fechacreacion)); //tag.usuario.nombre_completo
            case 'dudosa':
                return 'Compra dudosa ';
            default:
        }
    }

    const resolvePopoverContent = () => {
        switch (index){
            case 'proveedor':
                return 'Proveedor de la compra. ';
            case 'usuario':
                return 'Usuario que realizo la accion. ';
            case 'sucursal':
                return 'Sucursal en donde se paso la factura de compra.';
            case 'anulada':
                return <>Esta factura fue anulada por <b>{tag.usuario.nombre_completo}</b></>;
            case 'dudosa':
                if(tag.audicionresultado === 3)
                    return <>Compra cargada como precio excepcional por <b>{tag.usuario.nombre_completo}</b></>;
                if(tag.audicionresultado === 1)
                    return <>Compra marcada como mal cargada por <b>{tag.usuario.nombre_completo}</b></>;
                if(tag.audicionresultado === 2)
                    return <>Compra audtiada correctamente por <b>  {tag.usuario.nombre_completo}</b></>;

                return 'Compra dudosa no auditada al momento';
            default:
        }
    }

    const resolveDescription = (index, tag)=> {
        if(index === 'anulada')
        {
            return 'Anulada'; // +  + ' ' +
        }

        if(index === 'dudosa')
        {
            return tag.resultado;
        }

        return tag;
    }
    return <PopOver title={resolvePopoverTitle()} content={resolvePopoverContent()}>
        <Chip className={' text-white ' + resolveColor(index)}>{resolveDescription(index, tag)}</Chip>
    </PopOver>;
}
const ResolveTags = ({tags}) => {

    return tags ?
        <div className={'flex flex-row flex-wrap gap-1 mt-1'}>
            {map(tags, (tag, index) =>(<ChipTag tag={tag} index={index}/>))}</div>
        : '';
}
export const HistoricoDeArticulosWidget = ({idarticulo, setIdArticulo}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setIsOpen(idarticulo !== null);
        setErrorMessage(null);
        setData(null);
        if (idarticulo) {
            setLoading(true);
            const repo = new ArticulosHistoricoCostos();
            repo.getArticuloHistorico(idarticulo)
                .then((data) => {
                    setData(data);
                })
                .catch((err) => setErrorMessage(err?.message ?? err))
                .finally(() => setLoading(false));
        }
    }, [idarticulo])

    const content = data?.map((item, index) => ({
        body: <>
            <ResolveTags tags={item.tags}/>
            <div className={'pt-2'}>
                {item.links && item.links.map((link) => <a key={link.texto} href={link.url} target={'_blank'}
                                                           className={'text-blue-500 underline'}>{link.texto}</a>)}
            </div>
        </>
        ,
        title: <>
            <span className={(index === 0 ? 'text-white!' : '')}><LabelAddNumberSign number={item.precioconimpuesto}
                                                                                     symbol={'$'} decimales={2}/></span>
            <span className={'ml-1 ' + (index === 0 ? 'text-white!' : '')}> - {mapMedioToDescription(item.medio)}</span>
        </>,
        date: <span className={(index === 0 ? 'text-white!' : '')}>
            {processDate(moment(item.fechahora))}
            {index === 0 && <span className={'ml-2 italic'}>Precio actual</span>}
            </span>,
        icon: mapMedioToIcon(item.medio),
        className: index === 0 ? 'relative bg-green-800 text-white rounded-lg shadow-lg p-4 mb-4 mr-2' : ''
    }))


    const {data: articulo} = useArticulo(idarticulo);

    return <ErrorBoundary>
        <CustomModal
            widthEnPX={'l'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            copete={'Historico de costos del articulo seleccionado.'}
            cancelButtonVisible={false}
            onAceptar={() => {
                if (setIdArticulo) {
                    setIdArticulo(null)
                }
            }}
            titulo={articulo ? articulo.codigo + ' - ' + articulo.nombre : 'Loading'}
            loading={loading}
        >
            {errorMessage && <LabelError className={'ml-2'}>{errorMessage}</LabelError>}
            <TimeLine content={content}/>
        </CustomModal>
    </ErrorBoundary>
}
