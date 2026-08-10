
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";
import Authentication from "../resources/Authentication.jsx";
import Cajas from "@/resources/Cajas.jsx";
import Permisos from "@/resources/Permisos.jsx";

const usePermisos = (codigo) => {
    return useQuery({
        queryKey: ['tiene-permiso-para-' + codigo],
        queryFn: async () => {
            const permisosResources = new Permisos();
            return await permisosResources.permitido(codigo);
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 1 * 24, // 1 hours
    });

}

export { usePermisos };
