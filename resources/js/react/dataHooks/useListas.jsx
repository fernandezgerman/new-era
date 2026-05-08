import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";
import Authentication from "@/resources/Authentication.jsx";
const useLista = (listaId) => {
    return useQuery({
        queryKey: ['lista-'+listaId],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntity('listas', listaId);
        },
        enabled: !!listaId,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { useLista };
