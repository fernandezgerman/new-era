import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons/faChevronDown";
import {useAlertaDetalles, useAlertas} from "@/dataHooks/dashboard/useAlertas.jsx";
import {get, filter, reduce} from "lodash";
import {Hr} from "@/components/Hr.jsx";
import parse from 'html-react-parser';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {ToolTipWrapper} from "@/components/ToolTipWrapper.jsx";
import { RefreshNode} from "@/components/RefreshNode.jsx";
import {getAlertaDetallesQueryKey} from "../../dataHooks/dashboard/useAlertas.jsx";
import {useQueryClient} from "@tanstack/react-query";

const mapColours = {
    amarillo: '!bg-yellow-600',
    negro: 'bg-black',
    azul: 'bg-blue-600',
    rojo: 'bg-red-600',
    verde: 'bg-green-600'
};
const AlertaMenuDetalleInformes = ({informes, onMenuSelected}) => {

    const goToInforme = (informe) => {
        onMenuSelected(informe.codigopagina, 'Alertas', 'Informe',
            'POST', (informe?.parametros ?? []).map((parametro) => ({name: parametro.clave, value: parametro.valor, type: parametro.type ?? 'POST'})) );
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
        </div>
    );
}
const AlertaMenuDetalle = ({alertaDetalle, onMenuSelected}) => {

    const colour = get(mapColours, alertaDetalle.color.toLowerCase());

    return (
        <div className={'p-2 rounded-[5px]'}>
            <div className={colour + ' text-white h-auto w-full rounded-[5px] p-1 mb-2'}>
                {alertaDetalle.nombre}
                <div className={'float-right'}>{alertaDetalle.tiempoTranscurrido}</div>
            </div>
            <div className={'mb-2 text-xs'}>
                {alertaDetalle?.descripcion ? parse(alertaDetalle.descripcion) : ''}
            </div>
            <AlertaMenuDetalleInformes onMenuSelected={onMenuSelected} informes={alertaDetalle?.informes ?? []}/>
            <Hr/>
        </div>
    );
}
const AlertaMenuDetalles = ({alertaTipoId, onMenuSelected}) => {
    const {data, isLoading, isRefetching, refetch} = useAlertaDetalles(alertaTipoId);

    const alertaDetalles = data?.alertaDetalles ?? [];

    const loading = isLoading || isRefetching;
    return (
        <RefreshNode text={'Actualizar -'} refreshButtonFirst={true} onRefresh={refetch} loading={loading} className={'overflow-y-scroll scrollbar-hidden dark:!ne-dark-body dark:ne-dark-color text-xs w-auto max-h-[calc(100vh-150px)] max-w-[400px] h-auto p-2 pb-5 bg-white rounded-[10px] '}>
            {!isLoading && (
                <>
                    {(alertaDetalles).map((alertaDetalle) => <AlertaMenuDetalle onMenuSelected={onMenuSelected} alertaDetalle={alertaDetalle}/>)}
                </>
            )}
        </RefreshNode>);
}

const AlertaMenu = ({alertaMenu, onMenuSelected, loading}) => {

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
                    !loading && <AlertaMenuDetalles onMenuSelected={onMenuSelected} alertaTipoId={alertaMenu.id}/>}
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

export const Alertas = ({onMenuSelected}) => {
    const {data: alertas, refetch, isLoading, isRefetching} = useAlertas();
    const queryClient = useQueryClient();

    useEffect(() => {
        if(!isLoading &&  !isRefetching)
        {
            for(let alertaKey in alertas){
                let alerta = alertas[alertaKey];
                queryClient.removeQueries({ queryKey: [getAlertaDetallesQueryKey(alerta.id)]});
            }
        }

    }, [isLoading, isRefetching]);

    const loading = isLoading || isRefetching;

    return (
        <RefreshNode onRefresh={refetch} loading={loading} className={'w-auto max-w-[680px] px-3 my-auto flex items-center justify-end gap-4  nelg:ml-auto pt-[20px] nelg:pt-0 nelg:!mt-0'}>
            {(alertas ?? []).map((menu) => <AlertaMenu key={menu.id} loading={loading} onMenuSelected={onMenuSelected} alertaMenu={menu}/>)}
        </RefreshNode>
    );
}
