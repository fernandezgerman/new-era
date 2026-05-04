import React from 'react';
import {MercadoPagoDocumentacion} from "@/pages/mercadoPagoDocumentacion/index.jsx";
import {AgrupacionDeCajasLista} from "@/pages/agrupacionDeCajas/index.jsx";
import {AccesosAlSistema} from "@/pages/accesosAlSistema/index.jsx";
import {ListarAudits} from "@/pages/audits/index.jsx";
import {ValorizacionHistorico} from "@/pages/ValorizacionHistorico/index.jsx";
import {ArreglosDeStockChartCard} from "@/widgets/Dashboard/ArreglosStockChart/index.jsx";
import {ProcesamientoDeCostosDocumentacion} from "@/pages/procesamientoDeCostos/index.jsx";

// Documentacion: https://reactcommunity.org/react-modal/
export const ReactMenu = {
    "info-mp": MercadoPagoDocumentacion,
    "info-proc-costos": ProcesamientoDeCostosDocumentacion,
    "agrp-cajas": AgrupacionDeCajasLista,
    "cnf-accs-hra": AccesosAlSistema,
    "audits" :ListarAudits,
    "vlrs_histo" :ValorizacionHistorico,
    "mis-indicadores" : ArreglosDeStockChartCard,
};

export const GenerateComponent = ({pageCode}) => {
    const SpecificComponent = ReactMenu[pageCode];


    return SpecificComponent ? <SpecificComponent /> : <></>
}
