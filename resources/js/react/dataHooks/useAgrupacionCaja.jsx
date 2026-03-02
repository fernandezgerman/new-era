
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";
import Authentication from "../resources/Authentication.jsx";

const useAgrupacionCaja = (agrupacionCajaId, includes = []) => {
    return useQuery({
        queryKey: ['agrupacion-de-caja-' + agrupacionCajaId],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntity('agrupacionCaja', agrupacionCajaId, includes);
        },
        enabled: !!agrupacionCajaId,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 1, // 1 hours
    });

}

export { useAgrupacionCaja };
