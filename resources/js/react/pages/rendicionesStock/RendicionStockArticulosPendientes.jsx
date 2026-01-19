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

const RendicionStockArticuloRendir = ({articulo, handleKeyDown, inputRef, onClick}) => {
    const [cantidad, setCantidad] = useState(0);
    const [articuloCodigo, setArticuloCodigo] = useState(null);


    return <div className={'w-full mt-2'}>
        <Input type={'text'} placeHolder={'Ingrese el codigo del articulo'} value={articulo?.codigoArticulo ?? ''}
               inputClassName={' text-center bold text-[20px]! '}
               selectOnFocus
               className={'w-full'}/>
        {articulo && (
            <>
                <div className={'text-center align-middle h-[100px]'}>
                    {isMobile ? <h4>{articulo.articulo}</h4> : <h3>{articulo.articulo}</h3>}
                </div>
                <Table className={isMobile ? 'w-full' : 'w-[50%]! ml-[calc(50%-110px)]!'} data={[
                    [
                        {
                            content: <InLineLabel text={'Ultima compra'}/>,
                        },
                        {
                            content: articulo?.ultimaCompra?.compra?.fechahora ? moment(articulo?.ultimaCompra?.compra?.fechahora).format('D/M H:mm') : 'No hay',
                            className: 'text-right'
                        },
                    ],
                    [
                        {
                            content: <InLineLabel text={'Cantidad compra'}/>,
                        },
                        {
                            content: articulo?.ultimaCompra?.cantidad ?? 'No hay',
                            className: 'text-right'
                        },
                    ],
                    [
                        {
                            content: <InLineLabel text={'Costo'}/>,
                        },
                        {
                            content: articulo?.costoArticulo ? ('$' + parseFloat(articulo?.costoArticulo)?.toFixed(2)) : 'No definido',
                            className: 'text-right'
                        },
                    ],
                    [
                        {
                            content: <InLineLabel text={'Valor venta'}/>,
                        },
                        {
                            content: articulo?.precioVentaArticulo ? ('$' + parseFloat(articulo?.precioVentaArticulo)?.toFixed(2)) : 'No definido',
                            className: 'text-right'
                        },
                    ]
                ]
                }/>

                <div className={isMobile ? 'flex' : ''}>
                    <Input
                        ref={inputRef}
                        type={'number'}
                        className={'w-full '}
                        selectOnFocus
                        inputClassName={(isMobile ? 'text-[25px] w-full' : ' font-size-xxl ml-[calc(50%-100px)]! w-[200px]!') + '  justify-center text-center font-bold! mt-4! '}
                        value={cantidad}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                onClick(articulo, cantidad);
                                return;
                            }
                            handleKeyDown(event);
                        }}

                        setValue={setCantidad}
                    />
                    <Button className={'mt-5! bg-pink-500! ml-[calc(50%-55px)]!'}
                            onClick={() => onClick(articulo, cantidad)}>
                        Rendir
                    </Button>
                </div>
            </>)}
        {!articulo &&
            <div className={'mt-7 text-center'}>
                <b>Seleccione un articulo de la lista.</b>
            </div>
        }
    </div>;
}
export const RendicionStockArticulosPendientes = ({rendicionStock, onArticuloRendido}) => {

    const [isLoadingArticulos, setIsLoadingArticulos] = useState(true);
    const [isRindiendo, setIsRindiendo] = useState(false);
    const [articulosPendientes, setArticulosPendientes] = useState([]);
    const [articulosPendientesFiltrados, setArticulosPendientesFiltrados] = useState([]);
    const [error, setError] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const divRef = useRef(null);
    const inputCantidadRef = useRef(null);
    const inputBusquedaRef = useRef(null);

    const articuloSeleccionado = selectedIndex !== null && articulosPendientesFiltrados.length > selectedIndex
        ? articulosPendientesFiltrados[selectedIndex]
        : null;
    const loadArticulosPendientes = () => {
        const resource = new RendicionesDeStock();
        setIsLoadingArticulos(true);
        setError('');
        resource.getRendicionArticulosPendientes(rendicionStock.id)
            .then((response) => {
                setArticulosPendientes(response);
            })
            .finally(() => {
                setIsLoadingArticulos(false);
            })
            .catch(error => {
                setError(error?.message ?? error);
            });
    };
    useEffect(() => {
        if (rendicionStock !== null) {
            loadArticulosPendientes();
        }
    }, [rendicionStock]);


    const loading = rendicionStock === null || isLoadingArticulos;

    const data = articulosPendientesFiltrados ? articulosPendientesFiltrados.map((articulo, index) => {
        var fila = [];
        fila.push({
            content: <div
                ref={articulo.codigoArticulo === articuloSeleccionado?.codigoArticulo ? divRef : null}>{articulo.codigoArticulo + ' - ' + articulo.articulo}</div>,
            onClick: () => {
                setSelectedIndex(index);
                if (inputCantidadRef.current) {
                    inputCantidadRef.current.focus();
                }
            },
            className: articulo.codigoArticulo === articuloSeleccionado?.codigoArticulo
                ? ' bg-green-600! text-white text-xl font-bold '
                : ''
        });

        return fila;
    }) : [];


    useEffect(() => {
        setArticulosPendientesFiltrados(articulosPendientes);
    }, [articulosPendientes]);

    useEffect(() => {
        setArticulosPendientesFiltrados(articulosPendientes.filter((value) => (
            textoBusqueda === '' || String(value.codigo + value.articulo).toLowerCase().includes(String(textoBusqueda)?.toLowerCase()))
        ));
    }, [textoBusqueda, articulosPendientes]);

    const handleKeyDown = (event) => {

        if (event.key === 'Escape') {
            setTextoBusqueda('');
            setSelectedIndex(null);
            if (inputBusquedaRef.current) {
                inputBusquedaRef.current.focus();
            }
        }
        if (event.key === 'Enter') {
            if (selectedIndex !== null) {
                if (inputCantidadRef.current) {
                    inputCantidadRef.current.focus();
                }
            }
            event.preventDefault();
        }
        if (event.key === 'ArrowDown') {
            handleChangeSelectedIndex((selectedIndex !== null ? selectedIndex + 1 : 0));
            event.preventDefault();
        }

        if (event.key === 'ArrowUp') {
            handleChangeSelectedIndex((selectedIndex !== null ? selectedIndex - 1 : 0));
            event.preventDefault();
        }
    };

    const handleChangeSelectedIndex = (newIndex) => {
        if (!(articulosPendientesFiltrados?.length > newIndex)) {
            return false;
        }
        if (newIndex < 0) {
            return false;
        }
        scrollToDiv(newIndex > selectedIndex);
        setSelectedIndex(newIndex);

        return true;
    }

    // 2. Define the scrolling function
    const scrollToDiv = (up) => {
        if (divRef.current) {
            // Use the scrollIntoView method on the DOM node
            divRef.current.scrollIntoView({block: /* up ? "start" : */ "end", inline: "nearest"});
        }
    };

    const contentClassName = isMobile ? "w-full h-[250px] " : "flex h-[450px]";

    const onClickRendir = (articulo, cantidad) => {

        const rendicionStockResource = new RendicionesDeStock();
        setIsRindiendo(true);
        rendicionStockResource.setRendir(rendicionStock.id, articulo.idarticulo, cantidad)
            .then((result) => {
                setArticulosPendientes(articulosPendientes.filter((pendiente) => pendiente.idarticulo !== result?.articulo?.id))
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

    return <Card loading={loading || isRindiendo} onRefresh={loadArticulosPendientes} title={'Rendicion de articulos'}>
        <ErrorDisplayer errorDescription={error}/>
        <div className={contentClassName}>
            <div className={(isMobile ? 'w-full' : 'w-[50%] p-4') + " h-full flex "}>
                <div className={'w-full'}>
                    <p><InLineLabel text={isMobile ? '' : 'Articulos pendientes'} className={'font-size-[20px]'}/></p>
                    <div>
                        <Input ref={inputBusquedaRef} onKeyDown={handleKeyDown} value={textoBusqueda}
                               setValue={setTextoBusqueda} type={'text'} icon={faSearch} placeHolder={'Buscar articulo'}
                               className={'w-full mb-2'}/>
                    </div>
                    <div className={'overflow-y-scroll h-[calc(100%-70px)]'}>
                        <Table containerClassName={'w-full'} header={[[{content: 'Articulo'}]]} data={data}
                               destacarColumnasPares={true}/>
                    </div>
                </div>
            </div>
            <div className={(isMobile ? 'w-full' : 'w-[50%]') + " h-full   p-4"}>
                {!isMobile && <p><InLineLabel text={'Articulo seleccionado'} className={'font-size-[20px]'}/></p>}
                <RendicionStockArticuloRendir
                    inputRef={inputCantidadRef}
                    articulo={articuloSeleccionado}
                    handleKeyDown={handleKeyDown}
                    onClick={onClickRendir}
                />
            </div>
        </div>
    </Card>
}
