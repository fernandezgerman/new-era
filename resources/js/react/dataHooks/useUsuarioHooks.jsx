import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";

const useUsuarioSucursalesCaja = ({ usuarioId }) => {
    return useQuery({
        queryKey: ['usuario-sucursales-caja'+usuarioId],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntity('user', usuarioId, ['sucursalesCaja']);
        },
        enabled: !!usuarioId && usuarioId !== undefined ,
        select: (data) =>
            Object.values(data.sucursales_caja),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { useUsuarioSucursalesCaja };
