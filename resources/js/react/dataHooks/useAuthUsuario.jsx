import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";
import Authentication from "../resources/Authentication.jsx";

const useAuthUsuario = () => {
    return useQuery({
        queryKey: ['authentication-usuario-logueado'],
        queryFn: async () => {
            const authentication = new Authentication();
            return await authentication.me();
        },
        enable: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { useAuthUsuario };
