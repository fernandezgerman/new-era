import React, {useEffect, useState} from 'react';
import {RendicionesStockLista} from "@/pages/rendicionesStock/RendicionDeStockLista.jsx";
import {RendicionesStockRendir} from "@/pages/rendicionesStock/RendicionStockRendir.jsx";



export const RendicionesStock = () => {

    const [rendicionSeleccionada, setRendicionSeleccionada] = useState(null);



    return <>
            {rendicionSeleccionada === null && <RendicionesStockLista setRendicionSeleccionada={setRendicionSeleccionada} />}
            {rendicionSeleccionada !== null && <RendicionesStockRendir rendicionStockId={rendicionSeleccionada.id} />}
        </>
    ;
}
