import React from 'react';
import {MercadoPagoDocumentacion} from "@/pages/mercadoPagoDocumentacion/index.jsx";


export const ReactMenu = {
    "info-mp": MercadoPagoDocumentacion
};

export const GenerateComponent = ({pageCode}) => {
    const SpecificComponent = ReactMenu[pageCode];


    return SpecificComponent ? <SpecificComponent /> : <></>
}
