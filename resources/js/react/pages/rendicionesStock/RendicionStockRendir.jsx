import React, {useEffect, useState} from 'react';
import {Card} from "@/components/Card.jsx";
import {Table} from "@/components/Table.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {HO2} from "@/components/HOverlay.jsx";
import {AlertNeutral, AlertSuccess} from "@/components/Alerts.jsx";
import Resource from "@/resources/Resource.jsx";
import {ErrorDisplayer, InLineLabel} from "@/components/Displayers.jsx";
import {isMobile} from 'react-device-detect';
import moment from "moment";
import {RendicionStockArticulosPendientes} from "@/pages/rendicionesStock/RendicionStockArticulosPendientes.jsx";
import {RendicionStockArticulosRendidos} from "@/pages/rendicionesStock/RendicionDeStockArticulosRendidos.jsx";

const getRendicionStock = async ({rendicionStockId}) => {
    const resource = new Resource();
    return resource.getEntities(
        'RendicionStock',
        ['sucursal', 'rubro', 'usuario'],
        {id: rendicionStockId});

}
const RendicionDeStockCardMobile = ({rendicionStock}) => {
    return <Card loading={rendicionStock === null}>
        {rendicionStock && <div className={'w-full text-center'}>
            <b>{moment(rendicionStock.fechaapertura).format('hh:mm A')}</b>: {rendicionStock.sucursal.nombre} - {rendicionStock.rubro.nombre}
            <br/>
            {rendicionStock.usuario.nombre + ' ' + rendicionStock.usuario.apellido}
            <br/>
            <div className={'ml-[calc(50vw-90px)]'}>
                {rendicionStock.estado === 'PENDIENTE' ?
                    <AlertNeutral className={'p-x-1 py-1 w-28!'}>Pendiente</AlertNeutral> :
                    <AlertSuccess>Finalizado</AlertSuccess>}
            </div>
        </div>}

    </Card>;
}
const RendicionDeStockCard = ({rendicionStock}) => {

    const getData = (rendicionStock) => isMobile ?
        [
            [
                {
                    content: <InLineLabel text={'Sucursal'}/>,
                    className: 'p-1'
                },
                {
                    content: rendicionStock.sucursal.nombre,
                    className: 'p-1'
                }
            ],
            [
                {
                    content: <InLineLabel text={'Rubro'}/>,
                    className: 'p-1'
                },
                {
                    content: rendicionStock.rubro.nombre,
                    className: 'p-1'
                }
            ],
            [
                {
                    content: <InLineLabel text={'Usuario'}/>,
                    className: 'p-1'
                },
                {
                    content: rendicionStock.usuario.nombre + ' ' + rendicionStock.usuario.apellido,
                    className: 'p-1'
                }
            ],
            [
                {
                    content: <InLineLabel text={'Fecha'}/>,
                    className: 'p-1'
                },
                {
                    content: moment(rendicionStock.fechaapertura).format('D/M/Y'),
                    className: 'p-1'
                }
            ],
            [
                {
                    content: <InLineLabel text={'Hora'}/>,
                    className: 'p-1'
                },
                {
                    content: moment(rendicionStock.fechaapertura).format('hh:mm A'),
                    className: 'p-1'
                }
            ]
            ,
            [
                {
                    content: <InLineLabel text={'Estado'}/>,
                    className: 'p-1'
                },
                {
                    content: rendicionStock.estado === 'PENDIENTE' ?
                        <AlertNeutral className={'p-x-1 py-1 w-28!'}>Pendiente</AlertNeutral> :
                        <AlertSuccess>Finalizado</AlertSuccess>
                }
            ]
        ] :
        [
            [
                {
                    content: <InLineLabel text={'Sucursal'}/>,
                    className: 'p-1'
                },
                {
                    content: rendicionStock.sucursal.nombre,
                    className: 'pt-2'
                },
                {
                    content: <InLineLabel text={'Rubro'}/>,
                    className: 'p-1'
                },
                {
                    content: rendicionStock.rubro.nombre,
                    className: 'p-1'
                }
            ],
            [
                {
                    content: <InLineLabel text={'Usuario'}/>,
                    className: 'p-1'
                },
                {
                    content: rendicionStock.usuario.nombre + ' ' + rendicionStock.usuario.apellido,
                    className: 'p-1'
                },
                {
                    content: <InLineLabel text={'Fecha'}/>,
                    className: 'p-1'
                },
                {
                    content: moment(rendicionStock.fechaapertura).format('D/M/Y'),
                    className: 'p-1'
                }
            ],
            [
                {
                    content: <InLineLabel text={'Hora'}/>,
                    className: 'p-1'
                },
                {
                    content: moment(rendicionStock.fechaapertura).format('hh:mm A'),
                    className: 'p-1'
                },
                {
                    content: <InLineLabel text={'Estado'}/>,
                    className: 'p-1 pt-0'
                },
                {
                    content: rendicionStock.estado === 'PENDIENTE' ?
                        <AlertNeutral className={'p-x-1 py-1 w-28!'}>Pendiente</AlertNeutral> :
                        <AlertSuccess>Finalizado</AlertSuccess>,
                    className: 'p-1 pt-0'
                }
            ]
        ]
    ;

    const data = rendicionStock === null ? [] : getData(rendicionStock);
    return (<Card loading={rendicionStock === null}>
        <Table header={[]} data={data}/>
    </Card>);
}


export const RendicionesStockRendir = ({rendicionStockId}) => {
    const [rendicionStock, setRendicionStock] = useState(null);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [rendicionStockDetalles, setRendicionStockDetalles] = useState([]);

    useEffect(() => {
        getRendicionStock({rendicionStockId})
            .then((response) => {
                setRendicionStock(response[0]);
            })
            .finally(() => {
                setLoading(false);
            })
            .catch(error => {
                setError(error?.message ?? error);
            });
    }, []);

    const onArticuloRendido = (rendicionStockDetalle) => {
        setRendicionStockDetalles([
            ...rendicionStockDetalles, rendicionStockDetalle
        ])
    }

    return <ErrorBoundary>
        <div className={'h-[calc(100%-160px)] overflow-y-scroll '}>
            {!isMobile && <HO2 className="mt-5 flex justify-center ">Arreglos de stock</HO2>}
            <ErrorDisplayer errorDescription={error}/>
            {isMobile && <RendicionDeStockCardMobile rendicionStock={rendicionStock}/>}
            {!isMobile && <RendicionDeStockCard rendicionStock={rendicionStock}/>}
            <RendicionStockArticulosPendientes rendicionStock={rendicionStock} onArticuloRendido={onArticuloRendido}/>
            <RendicionStockArticulosRendidos rendicionStock={rendicionStock} rendicionStockDetalles={rendicionStockDetalles} onArticuloRendido={onArticuloRendido}/>
        </div>
    </ErrorBoundary>;
}
