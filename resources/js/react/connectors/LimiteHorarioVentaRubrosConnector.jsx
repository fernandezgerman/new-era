import ReactDOM from 'react-dom/client';
import React from 'react';
import {Login} from "../widgets/auth/login/login.jsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {MercadoPagoConfiguracionBySucursal} from "@/widgets/MercadoPago/MercadoPagoConfiguracionBySucursal.jsx";
import {LegacyDivContainer} from "@/components/Containers/LegacyDivContainer.jsx";
import {LimiteHorarioParaVentasPorRubro} from "@/widgets/Rubros/LimiteHorarioParaVentasPorRubro/index.jsx";

const queryClient = new QueryClient();

export const NODE_TO_INYECT = document.getElementById(
    'react-venta-rubros-por-hora-container',
);

export default () =>
{
    if (!NODE_TO_INYECT) return;

    const NODE = ReactDOM.createRoot(NODE_TO_INYECT);

    const rawRubroId = NODE_TO_INYECT.getAttribute('rubro-id');
    const parsedRubroId = Number(rawRubroId);
    const rubroId = rawRubroId && !Number.isNaN(parsedRubroId) && parsedRubroId > 0
        ? parsedRubroId
        : null;

    NODE.render(
        <QueryClientProvider client={queryClient}>
            <LegacyDivContainer className={'pl-5'}>
                <LimiteHorarioParaVentasPorRubro rubroId={rubroId} />
            </LegacyDivContainer>
        </QueryClientProvider>
    );
};
