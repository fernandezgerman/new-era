import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";

const useSucursales = () => {
    return useQuery({
        queryKey: ['sucursales-activas'],
        queryFn: async () => {
            const resource = new Resource();
            let filtros = [];
            filtros['activo'] = true;
            console.log('filtros', filtros)
            return await resource.getEntities('sucursal', ['usuariosCajas'], {'activo': true}, ['sucursales.nombre']);
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { useSucursales };
