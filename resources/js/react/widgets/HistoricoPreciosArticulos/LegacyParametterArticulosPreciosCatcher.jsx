import React, {useCallback, useEffect, useState} from 'react';
import {CustomModal} from "@/components/Modal.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {HistoricoDeArticulosWidget} from "@/widgets/HistoricoCostoArticulos/index.jsx";
import {HistoricoDePreciosDeArticulosWidget} from "@/widgets/HistoricoPreciosArticulos/index.jsx";


export const LegacyParametterArticulosPreciosCatcher = () => {

    const [idarticulo, setIdArticulo] = useState(null);

    const baseUrl = window.location.origin;

    const manejarMensajeDesdeIframe = useCallback((event) => {

        if (event.origin !== baseUrl){
            console.log('origin no coincide pra el mensaje: ', event.origin, baseUrl);
            return;
        }

        const { tipo, payload , accion} = event.data;

        if (tipo === 'IFRAME_EVENT' && accion === 'HISTORICO_DE_PRECIOS') {
            setIdArticulo(payload.idarticulo);
        }

    }, []);

    useEffect(() => {
        window.addEventListener('message', manejarMensajeDesdeIframe);

        return () => {
            window.removeEventListener('message', manejarMensajeDesdeIframe);
        };
    }, [manejarMensajeDesdeIframe]);

    return <ErrorBoundary>
        <HistoricoDePreciosDeArticulosWidget idarticulo={idarticulo} setIdArticulo={setIdArticulo} />
    </ErrorBoundary>
}
