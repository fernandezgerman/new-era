import React, {useCallback, useEffect, useState} from 'react';
import {CustomModal} from "@/components/Modal.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {HistoricoDeArticulosWidget} from "@/widgets/HistoricoCostoArticulos/index.jsx";
import {VerDetalleVentaSucursalModal} from "@/widgets/DetalleVentaSucursal/index.jsx";


export const DetalleVentaSucursalLegacyParametterCatcher = () => {

    const [idVentaSucursal, setIdVentaSucursal] = useState(null);

    const baseUrl = window.location.origin;

    const manejarMensajeDesdeIframe = useCallback((event) => {

        console.log('event in catcher', event);
        if (event.origin !== baseUrl){
            console.log('origin no coincide pra el mensaje: ', event.origin, baseUrl);
            return;
        }

        const { tipo, payload , accion} = event.data;

        if (tipo === 'IFRAME_EVENT' && accion === 'MOSTRAR_DETALLE_DE_VENTASUCURSAL') {
            setIdVentaSucursal(payload.idVentaSucursal);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('message', manejarMensajeDesdeIframe);

        return () => {
            window.removeEventListener('message', manejarMensajeDesdeIframe);
        };
    }, [manejarMensajeDesdeIframe]);

    return <ErrorBoundary>
        {idVentaSucursal && (<VerDetalleVentaSucursalModal idVentaSucursal={idVentaSucursal} setIdVentaSucursal={setIdVentaSucursal} />)}
    </ErrorBoundary>
}
