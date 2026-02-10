import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";

const useRubros = () => {
    return useQuery({
        queryKey: ['rubros-activos-noGasto'],
        queryFn: async () => {
            const resource = new Resource();
            let filtros = [];
            filtros['activo'] = true;
            return await resource.getEntities('rubro', [], { 'esrubrogastos': 0}, ['rubros.nombre']);
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { useRubros };
