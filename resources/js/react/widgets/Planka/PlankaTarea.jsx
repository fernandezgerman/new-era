import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useConfigValue} from "@/dataHooks/useConfigValue.jsx";

export const PlankaTarea = ({tareaId}) => {

    const iframeRef = useRef(null);
    const {data: cardView, isLoading, refetch, isRefetching} = useConfigValue({key: 'planka.card_view'});
    const [src, setSrc] = useState(null);
    const [counter, setCounter] = useState(0);
    const [visible, setVisible] = useState(true);

    console.log('src', src);

    const manejarMensajeDesdeIframe = useCallback((event) => {

        const {tipo, payload, accion} = event.data;

        console.log('event.data', event.data);
        if (tipo === 'IFRAME_EVENT' && accion === 'LOGIN_OIDC_END') {
            setCounter(counter + 1);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('message', manejarMensajeDesdeIframe);

        return () => {
            window.removeEventListener('message', manejarMensajeDesdeIframe);
        };
    }, [manejarMensajeDesdeIframe]);


    const mensaje = {
        tipo: 'IFRAME_EVENT',
        accion: 'LOGIN_OIDC_END',
        payload: null,
    };

   /* useEffect(() => {
        if(cardView) {
            //setSrc(cardView + tareaId + '?restrictMode=1&n=' + counter);
            setCounter(counter + 1);
        }
    }, [cardView])*/


    return  (
        <div className="w-full h-full">

            {cardView && !isLoading &&  (<iframe
                key={counter}
                ref={iframeRef}
                src={cardView + tareaId + '?restrictMode=1'}
                onChange={() => console.log('change')}
                title="Planka"
                className={'h-[calc(100%-20px)] w-full'}
                allow="clipboard-read; clipboard-write"
            ></iframe>)}
        </div>
    );
};
