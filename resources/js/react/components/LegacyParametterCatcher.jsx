import React, {useCallback, useEffect, useState} from 'react';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";


export const LegacyParametterCatcher = ({accionKey, Component}) => {

    const [payload, setPayload] = useState(null);

    const baseUrl = window.location.origin;

    const manejarMensajeDesdeIframe = useCallback((event) => {

        if (event.origin !== baseUrl){
            console.log('origin no coincide pra el mensaje: ', event.origin, baseUrl);
            return;
        }

        const { tipo, payload , accion} = event.data;


        if (tipo === 'IFRAME_EVENT' && accion === accionKey) {
            setPayload(payload);

        }

    }, []);

    useEffect(() => {
        window.addEventListener('message', manejarMensajeDesdeIframe);

        return () => {
            window.removeEventListener('message', manejarMensajeDesdeIframe);
        };
    }, [manejarMensajeDesdeIframe]);

    return <ErrorBoundary>
        {Component && <Component payload={payload} />}
    </ErrorBoundary>
}
