
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";
import Authentication from "../resources/Authentication.jsx";
import Cajas from "@/resources/Cajas.jsx";
import Liquidaciones from "@/resources/Liquidaciones.jsx";

const useValorizacionHistorico = (sucursalesId = []) => {
    return useQuery({
        queryKey: ['valorizacion-historico-' + sucursalesId.join('-')],
        queryFn: async () => {
            const resource = new Liquidaciones();
            return await resource.getValorizacionHistorico(sucursalesId);
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 1 hours
    });

}

export { useValorizacionHistorico };
