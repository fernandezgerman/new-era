import {useQuery} from "@tanstack/react-query";
import AlertasResource from "@/resources/AlertasResource.jsx";

const useTareasCreadasPorElUsuario = () => {
    return useQuery({
        queryKey: ['useTareasCreadasPorElUsuario-'],
        queryFn: async () => {
            const alertasResource = new AlertasResource();
            return await alertasResource.getTareasPorCreador();
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 1,
    });

}

export { useTareasCreadasPorElUsuario };
