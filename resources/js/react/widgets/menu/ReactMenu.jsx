import React from 'react';
import {MercadoPagoDocumentacion} from "@/pages/mercadoPagoDocumentacion/index.jsx";
import {AgrupacionDeCajasLista} from "@/pages/agrupacionDeCajas/index.jsx";
import {AccesosAlSistema} from "@/pages/accesosAlSistema/index.jsx";

// Documentacion: https://reactcommunity.org/react-modal/
export const ReactMenu = {
    "info-mp": MercadoPagoDocumentacion,
    "agrp-cajas": AgrupacionDeCajasLista,
    "cnf-accs-hra": AccesosAlSistema,
};

export const GenerateComponent = ({pageCode}) => {
    const SpecificComponent = ReactMenu[pageCode];


    return SpecificComponent ? <SpecificComponent /> : <></>
}
