import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";
import Authentication from "@/resources/Authentication.jsx";

const useSucursales = () => {
    return useQuery({
        queryKey: ['sucursales-activas'],
        queryFn: async () => {
            const resource = new Resource();
            let filtros = [];
            filtros['activo'] = true;
            return await resource.getEntities('sucursal', ['usuariosCajas'], {'activo': true}, 'sucursales.nombre');
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

const useSucursal = (sucursalId) => {
    return useQuery({
        queryKey: ['sucursal-'+sucursalId],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntity('sucursal', sucursalId);
        },
        enabled: !!sucursalId,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { useSucursales, useSucursal };
