import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";

const useAgrupacionCajas = () => {
    return useQuery({
        queryKey: ['agrupaciones-de-caja-41w1q2s'],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntities('AgrupacionCaja', ['cajas.sucursal', 'cajas.usuario',' usuarios.usuario'], [], ['descripcion']);
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 5, // 5 hours
    });

}

export { useAgrupacionCajas };
