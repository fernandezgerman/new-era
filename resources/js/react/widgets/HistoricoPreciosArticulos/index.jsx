import React, { useEffect, useState } from 'react';
import { CustomModal } from '@/components/Modal.jsx';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import ArticulosHistoricoCostos from "@/resources/ArticulosHistoricoDeCostos.jsx";
import { Label, LabelAddNumberSign, LabelError } from "@/components/Label.jsx";
import { TimeLine } from "@/components/TimeLine.jsx";
import { TbFileInvoice } from "react-icons/tb";
import { HiCalendar } from "react-icons/hi";
import { processDate } from "@/utils/dates.jsx";
import moment from "moment";
import { MdCalculate, MdOutlinePriceChange, MdOutlineSystemUpdateAlt } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import { Chip } from "@/components/Chip.jsx";
import { map, filter, pickBy } from "lodash";
import { useArticulo } from "@/dataHooks/useArticulos.jsx";
import { PopOver } from "@/components/PopOver.jsx";
import ArticulosHistoricoPrecios from "@/resources/ArticulosHistoricoDePrecios.jsx";
import { HistoricoDePrecioDetalles } from './HistoricoDePrecioDetalles.jsx';
export const HistoricoDePreciosDeArticulosWidget = ({idarticulo, setIdArticulo}) => {
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
            const repo = new ArticulosHistoricoPrecios();
            repo.getArticuloHistorico(idarticulo)
                .then((data) => {
                    setData(data);
                })
                .catch((err) => setErrorMessage(err?.message ?? err))
                .finally(() => setLoading(false));
        }
    }, [idarticulo])


    const content = data?.map((item, index) => ({
        body: <HistoricoDePrecioDetalles detalles={item.detalles}/>,
        title: <>
            <span className={'text-white!'}>{item.usuario.nombre_completo}</span>
        </>,
        date: <span className={'text-white!'}>
            {processDate(moment(item.fecha))}
            {index === 0 && <span className={'ml-2 italic'}>Ultima modificacion</span>}
            </span>,
        icon: HiCalendar,
        className: index === 0 ?
            'relative bg-green-800 text-white rounded-lg shadow-lg p-4 mb-4 mr-2'
            : 'relative bg-gray-500 text-white rounded-lg shadow-lg p-4 mb-4 mr-2'
    }))

    const {data: articulo} = useArticulo(idarticulo);

    return <ErrorBoundary>
        <CustomModal
            widthEnPX={'l'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            copete={'Historico de precios del articulo.'}
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
