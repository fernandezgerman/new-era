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
            return await resource.getEntities('rubro', [], { 'esrubrogastos': 0}, 'rubros.nombre');
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

const useRubro = (rubroId) => {
    return useQuery({
        queryKey: ['rubro-'+rubroId],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntity('rubro', rubroId);
        },
        enabled: !!rubroId,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { useRubro, useRubros };
