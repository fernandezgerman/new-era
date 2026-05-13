import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";

const useLiquidacionPeriodos = () => {
    return useQuery({
        queryKey: ['liquidacion-periodos'],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntities('liquidacion-periodo', [], null, {orden1: {name: 'id', direction: 'desc'}}, 500);
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

export {useLiquidacionPeriodos};

