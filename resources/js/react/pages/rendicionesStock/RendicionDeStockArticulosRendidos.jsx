import React, {useEffect, useState, useRef} from 'react';
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import RendicionesDeStock from "@/resources/RendicionesDeStock.jsx";
import {isMobile} from 'react-device-detect';
import {ErrorDisplayer, InLineLabel} from "@/components/Displayers.jsx";
import {Input} from "@/components/Input.jsx";
import {Card} from "@/components/Card.jsx";
import {Button} from "@/components/Buttons.jsx";
import {Table} from "@/components/Table.jsx";
import moment from "moment";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {get, map, reduce} from 'lodash';
import {H2} from "@/components/H.jsx";
import {LabelAddNumberSign, LabelBySign} from "@/components/Label.jsx";

export const RendicionStockArticulosRendidos = ({rendicionStock, rendicionStockDetalles, onArticuloRendido}) => {

    const [isLoadingArticulos, setIsLoadingArticulos] = useState(true);
    const [isRindiendo, setIsRindiendo] = useState(false);
    const [articulosRendidos, setArticulosRendidos] = useState([]);
    const [articulosPendientesFiltrados, setArticulosPendientesFiltrados] = useState([]);
    const [error, setError] = useState('');
    const [orden, setOrden] = useState('nombre');
    const [rendicionDetalleSeleccionada, setRendicionDetalleSeleccionada] = useState(null);
    const [cantidad, setCantidad] = useState(0);
    const inputRef = useRef(null);
    const loadArticulosRendidos = () => {
        const resource = new RendicionesDeStock();
        setIsLoadingArticulos(true);
        setError('');
        resource.getRendicionArticulosRendidos(rendicionStock.id)
            .then((response) => {
                setArticulosRendidos(response);
            })
            .finally(() => {
                setIsLoadingArticulos(false);
            })
            .catch(error => {
                setError(error?.message ?? error);
            });
    };

    useEffect(() => {
        if (rendicionDetalleSeleccionada !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [rendicionDetalleSeleccionada]);


    useEffect(() => {
        rendicionStockDetalles.map((rendicionDetalle) => {
            if (articulosRendidos.filter((rendido) => rendido.id === rendicionDetalle.id).length === 0) {
                setArticulosRendidos([
                    ...articulosRendidos,
                    {
                        "id": rendicionDetalle.id,
                        "idrendicion": rendicionDetalle.idrendicion,
                        "idarticulo": rendicionDetalle.articulo.id,
                        "cantidadsistema": rendicionDetalle.cantidadsistema,
                        "cantidadrendida": rendicionDetalle.cantidadrendida,
                        "fechahora": rendicionDetalle.fechahora,
                        "costo": rendicionDetalle.costo,
                        "valorsistema": rendicionDetalle.valorsistema,
                        "valorrendido": rendicionDetalle.valorrendido,
                        "precioventa": rendicionDetalle.precioventa,
                        "articulo": rendicionDetalle.articulo.nombre,
                        "codigoArticulo": rendicionDetalle.articulo.codigo,
                        "costoArticulo": rendicionDetalle.articulo.costo,
                        "existencia": null,
                        "precioVentaArticulo": null,
                        "hora": rendicionDetalle.hora,
                        "ultimaCompraDetalleId": null
                    }]);
            }
        })
    }, [rendicionStockDetalles]);

    useEffect(() => {
        if (rendicionStock !== null) {
            loadArticulosRendidos();
        }
    }, [rendicionStock]);

    const contentClassName = isMobile ? "w-full h-[250px] " : "flex h-[450px]";


    const articulosRendidosAgrupados = articulosRendidos.reduce((acum, rendicionDetalle) => {
        let articulo = get(acum, rendicionDetalle.idarticulo)

        if (!articulo) {
            articulo = {
                id: parseInt(rendicionDetalle.idarticulo),
                nombre: rendicionDetalle.articulo,
                codigo: rendicionDetalle.codigoArticulo,
                costo: parseFloat(rendicionDetalle.costoArticulo),
                precio: parseFloat(rendicionDetalle.precioVentaArticulo),
                existencia: parseInt(rendicionDetalle.existencia),
                rendiciones: []
            };
        }

        const rendicion = {
            hora: rendicionDetalle.hora,
            id: rendicionDetalle.id,
            idrendicion: rendicionDetalle.idrendicion,
            costo: rendicionDetalle.costo,
            valorRendido: rendicionDetalle.valorrendido,
            valorSistema: rendicionDetalle.valorsistema,
            cantidadRendida: rendicionDetalle.cantidadrendida,
            cantidadSistema: rendicionDetalle.cantidadsistema,
        };

        articulo.rendiciones.push(rendicion);

        return {...acum, [articulo.id]: articulo};
    }, {});

    const articulosRendidosAgrupadosArray = Object.values(articulosRendidosAgrupados) ?? null;


    const onClickCorregir = (rendicionId, articuloId, cantidad) => {

        const rendicionStockResource = new RendicionesDeStock();
        setIsRindiendo(true);
        rendicionStockResource.setRendir(rendicionId, articuloId, cantidad)
            .then((result) => {
                onArticuloRendido(result);
            })
            .finally(() => {
                setIsRindiendo(false);
            })
            .catch((error) => {
                setError(error?.message ?? error);
            })
        ;

    }

    const formatDataForTable = (row, index) => {

        let detalles = row.rendiciones.reduce((acum, rendicion, index)=> {

                if(index > 0 )
                {
                    acum.push([
                        {
                            content: <div className={'w-full text-center bg-pink-400 rounded-2xl'}>{'Correccion de rendicion ' + index}</div>,
                            colSpan: 4,
                        },
                    ])
                }

                acum.push([
                    {content: 'Cantidad'},
                    {content: <div className={' text-right p-3 '}><LabelAddNumberSign number={parseInt(rendicion.cantidadRendida)} symbol={'#'} /> </div>, className: 'text-right'},
                    {content: <div className={' text-right p-3 '}><LabelAddNumberSign number={parseInt(rendicion.cantidadSistema)} symbol={'#'} /> </div>, className: 'text-right'},
                    {content: <div className={' text-right p-3 '}><LabelAddNumberSign number={parseInt(rendicion.cantidadRendida - rendicion.cantidadSistema)} symbol={'#'} /> </div>, className: 'text-right'},
                ]);

                acum.push([
                    {content: 'Valorizado'},
                    {content: <div className={'text-right p-3 '}><LabelAddNumberSign number={parseFloat(rendicion.valorRendido).toFixed(2)} symbol={'#'} /></div>, className: 'text-right'},
                    {content: <div className={'text-right p-3 '}><LabelAddNumberSign number={parseFloat(rendicion.valorSistema).toFixed(2)} symbol={'#'} /></div>, className: 'text-right'},
                    {content: <div className={'text-right p-3 '}><LabelAddNumberSign number={parseFloat(rendicion.valorRendido - rendicion.valorSistema).toFixed(2)} symbol={'#'} /></div>, className: 'text-right'},
                ])

                return acum;

            }, []
        )

        detalles.push([
            {
                content: <div className={'w-full text-center ne-dark-body dark:ne-body  p-2 rounded-2xl'}>
                    <b>{'CORREGIR RENDICION'}</b>
                    <div className={'flex ml-[calc(50%-120px)] mt-5 mb-5'}>
                        <Input ref={inputRef} type={'number'}  className={'w-[120px]'} value={cantidad} setValue={setCantidad}/>
                        <Button type={'xs'} className={'mt-0! bg-pink-400! ml-2'} onClick={()=> onClickCorregir(rendicionStock.id, row.id, cantidad)} >Corregir</Button>
                    </div>
                </div>,
                colSpan: 4,
            },
        ])

        const gtRendicionDiference = (rendicion) => {
            return rendicion.rendiciones.reduce((acum, row) => (parseFloat(parseFloat(acum) + parseFloat(row.valorRendido) - parseFloat(row.valorSistema)).toFixed(2)) , 0)
        }

        const onRendicionClick = (row) => {
            if(row.id === rendicionDetalleSeleccionada?.id)
            {
                setRendicionDetalleSeleccionada(null);
                return;
            }
            setCantidad(null);
            setRendicionDetalleSeleccionada(row);
        }


        return [
            {
                content: <div className={'w-full'}>
                    <button className={'w-full cursor-pointer'} onClick={() => onRendicionClick(row)}>
                        <div className={'full flex'}>
                            <div className={'w-[80%] pl-[30px]'}><H2 >{row.codigo + ' - ' + row.nombre}</H2></div>
                            <div className={'w-[20%] text-right pr-[30px] relative' }><H2><LabelBySign symbol={'$'} number={gtRendicionDiference(row)} /> </H2></div>
                        </div>
                    </button>
                    {rendicionDetalleSeleccionada?.id === row.id && (
                        <div className={'bg-bl w-[520px] p-2 rounded-2xl ml-[calc(50%-250px)]'}>
                            <Table
                                className={' '}
                                header={[
                                    {name: ''},
                                    {name: 'Rendido', className: 'text-right pr-3'},
                                    {name: 'Sistema', className: 'text-right pr-3'},
                                    {name: 'Diferencia', className: 'text-right pr-3'},
                                ]}
                                data={detalles}
                            />

                        </div>
                    )}
                </div>
            },
        ];
    };
    /*
        if(articulosRendidosAgrupadosArray.length > 0){
            console.log('map(articulosRendidosAgrupados, (articulo, index) => formatDataForTable(articulo, index))', articulosRendidosAgrupadosArray?.reduce((acum, articulo, index) => {
                console.log('acum', acum, articulo, index);
                acum.push(formatDataForTable(articulo, index))
                console.log('acum', acum, articulo, index);
                return [acum];
            }), []);
        }*/

    return <Card onRefresh={loadArticulosRendidos} title={'Articulos rendidos'} className={'mb-[150px]]'}>
        <ErrorBoundary>
            <ErrorDisplayer errorDescription={error}/>
            <div className={contentClassName}>
                <div className={" w-full h-full flex "}>
                    <div className={'w-full'}>
                        <p><InLineLabel  className={'font-size-[20px]'}/></p>
                        <Table destacarColumnasPares header={[{content: 'ARTICULO'}]}
                               data={articulosRendidosAgrupadosArray.map((articulo, index) => formatDataForTable(articulo, index))}/>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    </Card>
}
