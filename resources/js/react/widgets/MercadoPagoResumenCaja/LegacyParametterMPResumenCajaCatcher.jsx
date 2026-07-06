import React, {useCallback, useEffect, useState} from 'react';
import {CustomModal} from "@/components/Modal.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {HistoricoDeArticulosWidget} from "@/widgets/HistoricoCostoArticulos/index.jsx";
import {HistoricoDePreciosDeArticulosWidget} from "@/widgets/HistoricoPreciosArticulos/index.jsx";
import {MercadoPagoResumenCaja} from "@/widgets/MercadoPagoResumenCaja/index.jsx";


export const LegacyParametterMPResumenCajaCatcher = () => {

    const [parametros, setParametros] = useState(null);
    const [isOpen, setIsOpen] = useState(null);

    const baseUrl = window.location.origin;

    const manejarMensajeDesdeIframe = useCallback((event) => {

        if (event.origin !== baseUrl){
            console.log('origin no coincide pra el mensaje: ', event.origin, baseUrl);
            return;
        }

        const { tipo, payload , accion} = event.data;

        if (tipo === 'IFRAME_EVENT' && accion === 'MOSTRAR_DETALLE_DE_CAJA') {
            setParametros(payload);
            setIsOpen(true);
        }

    }, []);

    useEffect(() => {
        window.addEventListener('message', manejarMensajeDesdeIframe);

        return () => {
            window.removeEventListener('message', manejarMensajeDesdeIframe);
        };
    }, [manejarMensajeDesdeIframe]);


    return <ErrorBoundary>
        {parametros !== null && (
            <MercadoPagoResumenCaja
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                idSucursal={parametros.idSucursal}
                idUsuario={parametros.idUsuario}
                numeroCaja={parametros.numeroCaja}
            />
        )}
    </ErrorBoundary>
}
