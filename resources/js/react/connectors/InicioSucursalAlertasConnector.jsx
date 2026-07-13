import ReactDOM from 'react-dom/client';
import React from 'react';
import {Login} from "../widgets/auth/login/login.jsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {InicioSucursalAlertas} from "@/widgets/InicioSucursalAlertas/index.jsx";

const queryClient = new QueryClient();

export const NODES_TO_INYECT = document.getElementsByName(
    'react-inicio-sucursal-alerta-container',
);

export default () =>
{
    if (NODES_TO_INYECT.length === 0) return;

    NODES_TO_INYECT.forEach(node => {
        const root = ReactDOM.createRoot(node);
        const sucursalId = Number(node.getAttribute('sucursal-id'));

        root.render(
            <QueryClientProvider client={queryClient}>
                <InicioSucursalAlertas idSucursal={sucursalId} />
            </QueryClientProvider>
        );
    });
};
