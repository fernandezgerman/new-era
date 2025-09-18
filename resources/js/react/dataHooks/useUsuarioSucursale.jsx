import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";

const useUsuarioSucursales = ({ usuarioId }) => {
    return useQuery({
        queryKey: ['usuario-sucursales-'+usuarioId],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntity('user', usuarioId, ['sucursales']);
        },
        enabled: !!usuarioId && usuarioId !== undefined ,
        select: (data) =>
            Object.values(data.sucursales),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { useUsuarioSucursales };
