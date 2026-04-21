import React, {useState} from 'react';
import {ArreglosChart} from "./Chart.jsx";
import {DashboardCard} from "@/widgets/Dashboard/DashboardCard.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {processNumber} from "@/utils/numbers.jsx";
import {ViewIconButton} from "@/components/Buttons.jsx";
import {
    useGraficosArreglosPorArticulosSucursal, useGraficosArreglosPorArticuloSucursal,
    useGraficosArreglosPorSucursal
} from "@/dataHooks/useRendicionStock.jsx";
import {Loading} from "@/components/Loading.jsx";
import {ToolTipWrapper} from "@/components/ToolTipWrapper.jsx";
import {processDate} from "@/utils/dates.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import moment from "moment";

const rnd = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

const articulosArreglos = [
    {fechahora: '15:23', usuario: 'Pepe Argento', diferencia: rnd(2, 100) * -1, importe: rnd(1000, 15236)},
    {fechahora: '5 12:11 ', usuario: 'Ruben Patagonia', diferencia: rnd(2, 100), importe: rnd(1000, 323954) * -1},
    {fechahora: '10:00 ', usuario: 'Pepe Mujica', diferencia: rnd(2, 100) * -1, importe: rnd(1000, 12364) * -1},
    {fechahora: '02/03', usuario: 'Tarantino', diferencia: rnd(2, 100), importe: rnd(1000, 635214)},
    {fechahora: '01/03', usuario: 'Pechito Lopez', diferencia: rnd(2, 100), importe: rnd(1000, 146156)},
]
const articulos = [
    {nombre: 'Mini pan dulce fini beijos 80gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Mini pan dulce peppa pig 80gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Red field natural 30gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Picador metal raimbow canabis', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Gatito rosa cucurucho', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Mini pan dulce galinha 80gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Snickers duplo chocolate 42g', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Mini pan dulce mym 80gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Mani con chocolate 100gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Garrapiñada de mani 100gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Malvavisco reno 1u', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Malvavisco muñeco de nieve 1u', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Chupetin casita de navidad 1u', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Mogul jelly beans 80gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Barra bnb pasa de uva 45gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Barra bnb drak chocolate 45gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Barra bnb arandanos 45gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Barra bnb almendras 45gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Barra bnb best protein salted caramel 60gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Barra bnb best protein frutos rojos 60gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Barra bnb best protein naranja 60gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Barra bnb best protein coco 60gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Ice breakers mints wintergreen 42gr', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
    {nombre: 'Marlboro gold titanium 20', cantidad: rnd(2, 100), importe: rnd(1000, 100000)},
];

const DetalleArreglosPorArticulo = ({fechaDesde, fechaHasta, idSucursal, idArticulo}) => {
    if (!fechaDesde || !fechaHasta || !idSucursal || !idArticulo) {
        return null;
    }

    const {data, isLoading} = useGraficosArreglosPorArticuloSucursal(fechaDesde, fechaHasta, idSucursal, idArticulo);

    return (<ErrorBoundary>
        {isLoading && <Loading className={'mt-5 col-span-8 text-center w-full'}/>}
        {!isLoading && data.length > 0 && data.map((item, index) => (
            <div key={index} className={'flex bg-pink-800 my-1 p-1 pl-2 md:mx-4'}>
                <div className={'text-sm text-gray-300 '}>
                    {/*<ViewIconButton/>*/ }
                </div>
                <div className={'text-sm text-gray-300 w-30'}>
                    {processDate(moment(item.fechahora))}
                </div>
                <div className={'text-sm text-gray-300 ml-2 w-60'}>
                    {item.nombre + ' ' + item.apellido}
                </div>
                <div className={'text-sm text-gray-300 ml-2 w-15 text-right'}>
                    {processNumber(item.diferencia, 0, false, '#')}
                </div>
                <div className={'text-sm text-gray-300 ml-2 w-30 text-right'}>
                    {processNumber(item.importe, 1, true, '$')}
                </div>
            </div>
        ))}
    </ErrorBoundary>);
}
const ShowMaxCharacters = ({text, maxCharacters = 100, className}) => {
    const isTruncated = text?.length > maxCharacters;
    const displayedText = isTruncated ? text.substring(0, maxCharacters) + "..." : text;

    if (isTruncated) {
        return (
            <ToolTipWrapper className={'bg-black text-white'} toolTip={text}>
                <span className={className}>{displayedText}</span>
            </ToolTipWrapper>
        );
    }

    return <span>{displayedText}</span>;
}

const TotalesPorArticulo = ({fechaDesde, FechaHasta, idSucursal}) => {

    const {data, isLoading} = useGraficosArreglosPorArticulosSucursal(fechaDesde, FechaHasta, idSucursal);
    const [selectedArticulo, setSelectedArticulo] = useState(null);
    const maxArticulosValue = data?.length > 0 && Math.max(...data?.map(item => Math.abs(item.total)));

    const determineArticulosWidth = (value) => {
        return Math.abs(value) / maxArticulosValue * 100;
    }

    return <>
        {isLoading && <Loading className={'mt-5 col-span-8 text-center w-full'}/>}
        {!isLoading && data.length > 0 && (

            <div
                className={'border-t-2 border-b-2 border-gray-100 mt-1 pt-1 md:px-5 col-span-8 grid grid-cols-8 text-gray-300'}>

                {data.map((articulo) => (<>

                        <div className={'text-xs col-span-8'}>
                            <button className={'underline hover:text-blue-800 w-full'}
                                    onClick={() => {
                                        if (selectedArticulo && selectedArticulo?.id === articulo.id)
                                            setSelectedArticulo(null)
                                        else
                                            setSelectedArticulo(articulo)
                                    }
                                    }>
                                <div className="relative">

                                    <div style={{width: `${determineArticulosWidth(articulo.total)}%`}}
                                         className={(articulo.total > 0 ? ' bg-green-800 ' : ' bg-red-800 ') + ' my-0.5 pl-2 text-gray-200'}>
                                        &nbsp;
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-right">
                                        <div className="text-center text-white w-[100px]">
                                            {processNumber(articulo.total, 1, true, '$')}
                                        </div>
                                        <div className="text-center text-white w-[100px]">
                                            {articulo.codigo}
                                        </div>
                                        <div className="text-center text-white">
                                            {articulo.nombre}
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {selectedArticulo && selectedArticulo?.id === articulo.id &&
                                (<>
                                        <DetalleArreglosPorArticulo
                                            fechaDesde={fechaDesde} fechaHasta={FechaHasta} idSucursal={idSucursal}
                                            idArticulo={articulo.id}/>
                                    </>
                                )}
                        </div>
                    </>)
                )}
            </div>)}
    </>;
}

const fakeData = [
    {nombre: 'Cordoba 2079', total: 90000},
    {nombre: 'Cordoba 1201', total: 10000},
    {nombre: 'Cordoba 1201 Cafe', total: 35000},
    {nombre: 'MT de Alvear 1699', total: 150000},
    {nombre: 'MT de Alvear 1699 Cafe', total: 25000},
    {nombre: 'Arenales 2101', total: 93000},
    {nombre: 'Juncal 1320', total: 85000},
    {nombre: 'Pacheco de Melo 1996', total: 15000},
    {nombre: 'Paraguay 902', total: 50000},
    {nombre: 'Charcas 4099 y Armenia', total: 60000},
    {nombre: 'Charcas 4401 y Thames', total: 70000},
    {nombre: 'MT de Alvear 708', total: 65000},
    {nombre: 'Cordoba 2400 Kiosco', total: 93000},
    {nombre: 'Cordoba 2400 Cafe', total: 115000},
    {nombre: 'Quintana 108 Kiosco', total: 99000},
];

const GraficoLinealHorizontal = ({fechaDesde, fechaHasta, semana}) => {


    const {data: dataPorSucursal, isLoading} = useGraficosArreglosPorSucursal(fechaDesde, fechaHasta);
    const [selectedSucursal, setSelectedSucursal] = useState(null);

    const data = dataPorSucursal;

    const orderedData = data && data.sort((a, b) => a.total - b.total);
    const articulosOrdenados = articulos.sort((a, b) => b.importe - a.importe);

    const minValue = data && Math.min(...data.map(item => Math.abs(item.total)));
    const maxValue = data && Math.max(...data.map(item => Math.abs(item.total)));

    const determineWidth = (value) => {
        return Math.abs(value) / maxValue * 100;
    }


    const [visibilidadDetalle, setVisibilidadDetalle] = useState([]);

    return semana && (
        <div className={'mt-6'}>
            <div className={'text-2xl font-bold text-center mb-4'}>
                Detalle de arreglos: {semana.semana}
                {isLoading && <Loading className={'mt-5'}/>}
            </div>

            {!isLoading && data && data.length > 0 &&
                (
                    <>
                        <div className={'grid grid-cols-6 text-gray-300 md:px-14'}>
                            {orderedData.map((item, index) => (
                                <div className={'col-span-6'}>
                                    <button className={'underline hover:text-blue-800 w-full'}
                                            onClick={() => {
                                                if (item && item.id === selectedSucursal?.id)
                                                    setSelectedSucursal(null)
                                                else
                                                    setSelectedSucursal(item)
                                            }}>
                                        <div className="relative my-0.5">
                                            <div style={{width: `${determineWidth(item.total)}%`}}
                                                 className="bg-blue-600">
                                                &nbsp;
                                            </div>
                                            <div
                                                className=" pl-2  font-bold  absolute inset-0 bg-black/40 flex items-center justify-right">
                                                <div className={'w-64 text-left'}>
                                                    {item.nombre}
                                                </div>
                                                <div className={'w-20 text-right'}>
                                                    {processNumber(item.total, 1, true, '$')}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    {selectedSucursal && selectedSucursal.id === item.id && (
                                        <TotalesPorArticulo fechaDesde={fechaDesde} FechaHasta={fechaHasta}
                                                            idSucursal={item.id}/>)}
                                </div>
                            ))}
                        </div>
                    </>)
            }
        </div>);
}
export const ArreglosDeStockChartCard = () => {
    const [fechaDesde, setFechaDesde] = useState(null);
    const [fechaHasta, setFechaHasta] = useState(null);
    const [semana, setSemana] = useState(null);

    const handleSelectSemana = (valueFechaDesde, valueFechaHasta, semana) => {
        setFechaDesde(valueFechaDesde);
        setFechaHasta(valueFechaHasta);
        setSemana(semana);
    }

    return (
        <DashboardCard className="col-span-6">
            <ArreglosChart handleSelectSemana={handleSelectSemana}/>
            <GraficoLinealHorizontal fechaDesde={fechaDesde} fechaHasta={fechaHasta} semana={semana}/>
        </DashboardCard>
    );
};
