// archivo: src/widgets/mountHistorico.tsx   (o el que estés usando)

import ReactDOM from 'react-dom/client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactModal from "react-modal";

import { HistoricoDeArticulosWidget } from "@/widgets/HistoricoCostoArticulos/index.jsx";
import {RenderComponentWithAttributeInTagProvider} from "@/connectors/Utils/RenderComponentWithAttributeInTagProvider.jsx";
import {TailwindShadowProvider} from "@/connectors/Utils/TailwindShadowProvider.jsx";

const queryClient = new QueryClient();

const NODE_TO_INYECT = document.getElementById('visualizar-historico-costos');

export default () => {
    if (!NODE_TO_INYECT) {
        console.warn('No se encontró el contenedor #visualizar-historico-costos');
        return;
    }

    // Crear Shadow DOM
    const shadow = NODE_TO_INYECT.attachShadow({ mode: 'open' });

    // Pequeño delay para que el navegador procese el CSS antes de renderizar React
    setTimeout(() => {
        const root = ReactDOM.createRoot(shadow);

        const articuloId = NODE_TO_INYECT.getAttribute('data-articulo-id') || '';

        // ReactModal: el selector debe estar dentro del shadow o usar el host
        ReactModal.setAppElement(shadow.host);   // mejor que el selector fijo

        const tailwindPath = window.tailwindCssUrl;


        root.render(
            <QueryClientProvider client={queryClient}>
                {/* Renderiza el componente HistoricoDeArticulosWidget con el atributo articuloId del NODE_TO_INYECT, disparando un render cada vez que este cambia*/}
                <RenderComponentWithAttributeInTagProvider dataTag={'data-articulo-id'} propName={'idarticulo'} node={NODE_TO_INYECT}>
                    <TailwindShadowProvider >
                        <HistoricoDeArticulosWidget idarticulo={articuloId}  />
                    </TailwindShadowProvider>
                </RenderComponentWithAttributeInTagProvider>
            </QueryClientProvider>
        );
    }, 10);
};
