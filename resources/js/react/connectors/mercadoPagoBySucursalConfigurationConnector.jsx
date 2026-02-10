import ReactDOM from 'react-dom/client';
import React from 'react';
import {Login} from "../widgets/auth/login/login.jsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Dashboard} from "../pages/dashboard/index.jsx";
import {MercadoPagoConfiguracionBySucursal} from "@/widgets/MercadoPago/MercadoPagoConfiguracionBySucursal.jsx";
import {LegacyDivContainer} from "@/components/Containers/LegacyDivContainer.jsx";

const queryClient = new QueryClient();

export const NODE_TO_INYECT = document.getElementById(
    'mercado-pago-configuracion-sucursal-container',
);

export default () =>
{
    if (!NODE_TO_INYECT) return;

    const NODE = ReactDOM.createRoot(NODE_TO_INYECT);

    const sucursalId = Number(NODE_TO_INYECT.getAttribute('sucursal-id'));

    const modoDeCobroId = Number(NODE_TO_INYECT.getAttribute('modo-de-cobro-id'));

    const modoDeCobroPointId = Number(NODE_TO_INYECT.getAttribute('modo-de-cobro-point-id'));

    NODE.render(
        <QueryClientProvider client={queryClient}>
            <LegacyDivContainer>
                {/*<MercadoPagoConfiguracionBySucursal sucursalId={sucursalId} modoDeCobroId={modoDeCobroId} modoDeCobroPointId={modoDeCobroPointId} tipo={'QR'} /> */}
                <MercadoPagoConfiguracionBySucursal sucursalId={sucursalId} modoDeCobroId={modoDeCobroPointId} tipo={'POINT'}/>
            </LegacyDivContainer>
        </QueryClientProvider>
    );
};
