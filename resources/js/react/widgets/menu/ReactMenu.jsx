import React from 'react';
import {RendicionesStock} from "@/pages/rendicionesStock/index.jsx";

export const ReactMenu = {
    rendstocka: RendicionesStock
};

export const GenerateComponent = ({pageCode}) => {
    const SpecificComponent = ReactMenu[pageCode];


    return SpecificComponent ? <SpecificComponent /> : <></>
}
