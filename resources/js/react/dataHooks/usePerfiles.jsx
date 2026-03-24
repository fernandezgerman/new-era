
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";

const usePerfiles = () => {
    return useQuery({
        queryKey: ['perfiles-activos'],
        queryFn: async () => {
            const resource = new Resource();
            let filtros = [];
            filtros['activo'] = true;
            filtros['idempresa'] = 6;
            return await resource.getEntities('perfil', [], filtros, 'perfiles.nombre');
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { usePerfiles };
