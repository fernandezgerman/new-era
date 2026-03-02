
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";
import Authentication from "../resources/Authentication.jsx";
import Cajas from "@/resources/Cajas.jsx";

const useUltimaCaja = (usuarioId, sucursalId) => {
    return useQuery({
        queryKey: ['ultima-caja-' + sucursalId + '-' + usuarioId],
        queryFn: async () => {
            const cajasResource = new Cajas();
            return await cajasResource.getUltimaCaja(usuarioId, sucursalId);
        },
        enabled: !!sucursalId && !!usuarioId,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 1, // 1 hours
    });

}

export { useUltimaCaja };
