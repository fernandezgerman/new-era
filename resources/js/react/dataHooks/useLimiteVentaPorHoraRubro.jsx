import Resource from "../resources/Resource.jsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

const ENTITY = 'LimiteVentaPorHoraRubro';
const queryKeyForRubro = (rubroId) => ['limite-venta-por-hora-rubro', rubroId];

const useLimiteVentaPorHoraRubro = (rubroId) => {
    return useQuery({
        queryKey: queryKeyForRubro(rubroId),
        queryFn: async () => {
            const resource = new Resource();
            const result = await resource.getEntities(ENTITY, [], {idrubro: rubroId});
            return Array.isArray(result) && result.length > 0 ? result[0] : null;
        },
        enabled: !!rubroId,
        staleTime: 1000 * 60 * 5,
    });
};

const useSaveLimiteVentaPorHoraRubro = (rubroId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({id, data}) => {
            const resource = new Resource();
            if (id) {
                return await resource.updateEntity(ENTITY, id, data);
            }
            return await resource.insertEntity(ENTITY, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: queryKeyForRubro(rubroId)});
        },
    });
};

export {useLimiteVentaPorHoraRubro, useSaveLimiteVentaPorHoraRubro};
