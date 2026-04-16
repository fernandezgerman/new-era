import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile, faInfo, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons/faChevronDown";
import {useAlertaDetalles, useAlertas} from "@/dataHooks/dashboard/useAlertas.jsx";
import {get, filter, reduce} from "lodash";
import {Hr} from "@/components/Hr.jsx";
import parse from 'html-react-parser';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {ToolTipWrapper} from "@/components/ToolTipWrapper.jsx";
import {RefreshNode} from "@/components/RefreshNode.jsx";
import {getAlertaDetallesQueryKey} from "../../dataHooks/dashboard/useAlertas.jsx";
import {useQueryClient} from "@tanstack/react-query";
import {isMobile} from "react-device-detect";
import {Loading} from "@/components/Loading.jsx";
import {Button} from "@/components/Buttons.jsx";
import {PopOver} from "@/components/PopOver.jsx";
import AlertasResource from "@/resources/AlertasResource.jsx";
import {ChipBlue, ChipGreen} from "@/components/Chip.jsx";

const mapColours = {
    amarillo: '!bg-yellow-600',
    negro: 'bg-black',
    azul: 'bg-blue-600',
    rojo: 'bg-red-600',
    verde: 'bg-green-600'
};
const ShowAlertaArreglosInfo = () => {

    return (
        <div className={'float-right'}>
            <PopOver
                className={'float-right w-50 md:w-100  '}
                title={'Alertas de arreglos de stock'}
                content={<p>
                    En el menu superior apareceran en circulos las alertas que no esten como <b>"leidas"</b>
                    <br />
                    <br />
                    <div className={'mt-2 inline-block rounded-lg w-5 h-5 bg-black'}></div> Cuando superan $100k <br/>
                    <div className={'mt-2 inline-block rounded-lg w-5 h-5 bg-yellow-600'}></div> Cuando superan -$100k<br/>
                    <div className={'mt-2 inline-block rounded-lg w-5 h-5 bg-red-600'}></div> Cuando superan -$150k<br/>
                    <br />
                    <ChipBlue>No leido </ChipBlue> Presione este boton para marcar como leida la alerta, esta continuara en la lista pero no sumara en los circulos del menu.
                    <br />
                    <br />
                    Todas las alertas se eliminaran luego de 30 dias de forma permanente.
                </p>}
            >
                <ChipBlue> <FontAwesomeIcon icon={faInfo}/></ChipBlue>
            </PopOver>
        </div>
    );
}

const AlertaMenuDetalleInformes = ({informes, onMenuSelected, children}) => {

    const goToInforme = (informe) => {
        onMenuSelected(informe.codigopagina, 'Alertas', 'Informe',
            'POST', (informe?.parametros ?? []).map((parametro) => ({
                name: parametro.clave,
                value: parametro.valor,
                type: parametro.type ?? 'POST'
            })));
    }
    return (
        <div>
            {informes.map((informe) => {
                return (
                    <div className={'flex items-center justify-between'}>
                        <div className={'flex items-center'} onClick={() => goToInforme(informe)}>
                            <FontAwesomeIcon icon={faFile} className={'mr-2'}/>
                            <div className={'text-xs underline cursor-pointer'}>
                                {informe.nombre}
                            </div>
                        </div>
                    </div>
                )
            })}
            {children}
        </div>
    );
}
const AlertaMenuDetalle = ({alertaDetalle, onMenuSelected, refetch}) => {

    const colour = get(mapColours, alertaDetalle.color.toLowerCase());
    const alertaDescripcionPosition = isMobile ? '' : ' float-right ';

    const leido = alertaDetalle.fechavisto !== null && parseInt(alertaDetalle.id) === 2;

    const [marking, setMarking] = useState(false);
    const MarcarAlerta = () => {
        const alertaResource = new AlertasResource();
        setMarking(true);
        if (leido) {
            alertaResource.marcarAlertaComoNoLeida(alertaDetalle.idAlerta).then(() => refetch()).finally(() => setMarking(false));
        } else {
            alertaResource.marcarAlertaComoLeida(alertaDetalle.idAlerta).then(() => refetch()).finally(() => setMarking(false));
        }

    }

    return (
        <div className={isMobile ? '' : ' p-2 ' + ' rounded-[5px] ' + (leido ? ' opacity-50 ' : '')}>
            <div className={colour + ' text-white text-center sm:text-left! h-auto w-full rounded-[5px] p-1 mb-2'}>
                {alertaDetalle.nombre}
                <div className={alertaDescripcionPosition}>{alertaDetalle.tiempoTranscurrido}</div>
            </div>
            <div className={'mb-2 text-xs'}>
                {alertaDetalle?.descripcion ? parse(alertaDetalle.descripcion) : ''}
            </div>
            <div className={'grid grid-cols-4'}>
                <div className={'col-span-3'}>
                    <AlertaMenuDetalleInformes onMenuSelected={onMenuSelected}
                                               informes={alertaDetalle?.informes ?? []}/>
                </div>
                {parseInt(alertaDetalle.id) === 2 && (
                    <div className={'pr-2'}>
                        <button className={'float-right '} onClick={MarcarAlerta}>
                            {leido ?
                                <ChipGreen loading={marking} className={'float-right cursor-pointer'}>Leido</ChipGreen> :
                                <ChipBlue loading={marking} className={'float-right cursor-pointer'}>No leido </ChipBlue>}
                        </button>
                    </div>
                )}

            </div>
            <Hr/>
        </div>
    );
}
const AlertaMenuDetalles = ({alertaTipoId, onMenuSelected, refetchHeader}) => {
    const {data, isLoading, isRefetching, refetch} = useAlertaDetalles(alertaTipoId);
    const [filtrarVistos, setFiltrarVistos] = useState(false);

    const alertaDetalles = (data?.alertaDetalles ?? []).filter((alertaDetalle) => alertaDetalle.fechahoravisto === null || filtrarVistos === false);

    const loading = isLoading || isRefetching;

    const MarcarAlertasComoLeidas = () => {
        const alertasResource = new AlertasResource();
        alertasResource.marcarAlertasComoLeidas(alertaTipoId).then((response) => {
            refetch();
            refetchHeader();
        })

    }

    return (
        <>
            <RefreshNode text={loading ? 'Aguarde ' : 'Actualizar -'} refreshButtonFirst={true} onRefresh={refetch}
                         loading={loading}
                         header={<>Marcar todos como leidos</>}
                         className={' overflow-y-scroll scrollbar-hidden dark:!ne-dark-body dark:ne-dark-color text-xs w-auto max-h-[calc(100vh-150px)] max-w-[400px]  h-auto p-2 pb-5 bg-white rounded-[10px] '}>
                {!isLoading && (
                    <>
                        {alertaTipoId === 2 && alertaDetalles.length !== 0 && (<PopOver
                            className={' w-70'}
                            title={'Marcar todos como leidos'}
                            content={<p>
                                Marca todas las alertas como <i><b>Leidas</b></i>.
                                <br/><br/>
                                Seguiran apareciendo en la lista pero no en los circulos de colores.

                                <br/>
                                <br/>
                                <Button
                                    type={'button'}
                                    format={'xs'}
                                    onClick={MarcarAlertasComoLeidas}
                                    className={'mt-2'}>
                                    Marcar todo como leido
                                </Button>
                            </p>}
                        >
                            <div
                                className={'text-xs underline cursor-pointer my-2 ml-2 text-pink-800 dark:text-pink-500'}>
                                Marcar todo como leido
                            </div>
                        </PopOver>)}

                        {alertaTipoId === 2 && (<button onClick={() => setFiltrarVistos(!filtrarVistos)}>
                            <div
                                className={'text-xs underline cursor-pointer my-2 ml-2 text-pink-800 dark:text-pink-500'}>
                                {filtrarVistos ? 'Ver todo' : 'Ver no leidos'}
                            </div>
                        </button>)}

                        {alertaTipoId === 2 && <ShowAlertaArreglosInfo/>}
                    </>
                )}

                {!isLoading && alertaDetalles.length > 0 && (alertaDetalles).map((alertaDetalle) => <AlertaMenuDetalle
                    onMenuSelected={onMenuSelected}
                    refetch={() => {
                        refetch();
                        refetchHeader();
                    }}
                    alertaDetalle={alertaDetalle}/>)}

                {!isLoading && alertaDetalles.length === 0 && (
                    <div className={'text-center font-bold p-10'}> No se encontraron alertas!</div>
                )}
            </RefreshNode>
        </>);
}

const AlertaMenu = ({alertaMenu, onMenuSelected, loading, refetchHeader}) => {

    const circles = reduce(alertaMenu, (carry, value, key) => {

            if (get(mapColours, key) !== undefined && parseInt(value) > 0) {
                carry.push({value: parseInt(value), key: key});
            }

            return carry;
        }, []
    );

    return (
        <div>
            <ErrorBoundary>
                <ToolTipWrapper toolTip={
                    !loading && <AlertaMenuDetalles refetchHeader={refetchHeader} onMenuSelected={onMenuSelected}
                                                    alertaTipoId={alertaMenu.id}/>}
                >
                    <div className={'h-[35px]'}>
                        <div
                            className={'capitalize ne-body dark:ne-dark-body dark:ne-dark-color px-2 py-1 cursor-pointer transition-colors hover:bg-gray-200 hover:text-black rounded-[5px] border dark:!border-gray-600 '}>
                            {alertaMenu.codigo.toLowerCase()} <FontAwesomeIcon className={'ml-2'} icon={faChevronDown}/>
                        </div>

                        <div className={'relative mt-[-45px] w-auto flex justify-end pr-[5px]'}>
                            {circles.length === 0 && <div
                                className={'ml-0.5 text-xs float-right rounded-[15px] h-[20px] p-0.5 w-[20px] text-center text-white align-middle'}>

                            </div>}
                            {circles.map((circle, index) => {
                                const colour = get(mapColours, circle.key);
                                return (
                                    <div
                                        key={index}
                                        className={'ml-0.5 text-xs float-right rounded-[15px] ' + colour + ' h-[20px] p-0.5 w-[20px] text-center text-white align-middle'}>
                                        {circle.value}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </ToolTipWrapper>
            </ErrorBoundary>
        </div>);
}


const AlertaMenuMobile = ({alertaMenu, setAlertaSeleccionada, alertaSeleccionada}) => {

    const circles = reduce(alertaMenu, (carry, value, key) => {

            if (get(mapColours, key) !== undefined && parseInt(value) > 0) {
                carry.push({value: parseInt(value), key: key});
            }

            return carry;
        }, []
    );

    const ButtonState = alertaSeleccionada === alertaMenu.id ? ' font-bold ne-dark-body! ne-dark-color! dark:text-gray-600! dark:bg-white! ' : alertaMenu.id;

    return (
        <div>
            <ErrorBoundary>
                <button className={'h-[35px] w-full mb-2 mt-2 '}
                        onClick={() => setAlertaSeleccionada(alertaSeleccionada === alertaMenu.id ? null : alertaMenu.id)}>
                    <div
                        className={'capitalize ne-body dark:ne-dark-body dark:ne-dark-color px-2 py-1 cursor-pointer rounded-[5px] border dark:!border-gray-600 ' + ButtonState}>
                        {alertaMenu.codigo.toLowerCase()}
                    </div>

                    <div className={'relative mt-[-45px] w-auto flex justify-end pr-[5px]'}>
                        {circles.length === 0 && <div
                            className={'ml-0.5 text-xs float-right rounded-[15px] h-[20px] p-0.5 w-[20px] text-center text-white align-middle'}>

                        </div>}
                        {circles.map((circle, index) => {
                            const colour = get(mapColours, circle.key);
                            return (
                                <div
                                    key={index}
                                    className={'ml-0.5 text-xs float-right rounded-[15px] ' + colour + ' h-[20px] p-0.5 w-[20px] text-center text-white align-middle'}>
                                    {circle.value}
                                </div>
                            )
                        })}
                    </div>
                </button>
            </ErrorBoundary>
        </div>);
}

export const Alertas = ({onMenuSelected}) => {
    const {data: alertas, refetch, isLoading, isRefetching} = useAlertas();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isLoading && !isRefetching) {
            for (let alertaKey in alertas) {
                let alerta = alertas[alertaKey];
                queryClient.removeQueries({queryKey: [getAlertaDetallesQueryKey(alerta.id)]});
            }
        }

    }, [isLoading, isRefetching]);

    const loading = isLoading || isRefetching;

    return (alertas ?? []).length > 0 && (
        <RefreshNode onRefresh={refetch} loading={loading}
                     className={'w-auto max-w-[680px] px-3 my-auto flex items-center justify-end gap-4  nelg:ml-auto pt-[20px] nelg:pt-0 nelg:!mt-0'}>
            {(alertas ?? []).map((menu) => <AlertaMenu key={menu.id} loading={loading} onMenuSelected={onMenuSelected}
                                                       refetchHeader={refetch}
                                                       alertaMenu={menu}/>)}
        </RefreshNode>
    );
}

export const AlertasMobile = ({onMenuSelected}) => {
    const {data: alertas, refetch, isLoading, isRefetching} = useAlertas();
    const queryClient = useQueryClient();
    const [alertaSeleccionada, setAlertaSeleccionada] = useState(null);

    useEffect(() => {
        if (!isLoading && !isRefetching) {
            for (let alertaKey in alertas) {
                let alerta = alertas[alertaKey];
                queryClient.removeQueries({queryKey: [getAlertaDetallesQueryKey(alerta.id)]});
            }
        }

    }, [isLoading, isRefetching]);


    const loading = isLoading || isRefetching;

    return (alertas ?? []).length > 0 && (
        <>

            {(alertas ?? []).map((menu) => <AlertaMenuMobile key={menu.id} loading={loading}
                                                             onMenuSelected={onMenuSelected} alertaMenu={menu}
                                                             setAlertaSeleccionada={setAlertaSeleccionada}
                                                             alertaSeleccionada={alertaSeleccionada}
            />)}

            <ErrorBoundary>
                {!loading && alertaSeleccionada !== null &&
                    <AlertaMenuDetalles refetchHeader={refetch} onMenuSelected={onMenuSelected}
                                        alertaTipoId={alertaSeleccionada}/>}
            </ErrorBoundary>
        </>
    );
}
