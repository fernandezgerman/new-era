import Resource from "../resources/Resource.jsx";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";

const emptyArray = [];
const useAccesosPorHora = () => {
    return useQuery({
        queryKey: ['accesos-por-hora'],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntities('AccesosPorHora');
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

const useInsertAccesoPorHora = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const resource = new Resource();
            return await resource.insertEntity('AccesosPorHora', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accesos-por-hora'] });
        },
    });
};

const useUpdateAccesoPorHora = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const resource = new Resource();
            return await resource.updateEntity('AccesosPorHora', id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accesos-por-hora'] });
        },
    });
};

const useDeleteAccesoPorHora = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const resource = new Resource();
            return await resource.deleteEntity('AccesosPorHora', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accesos-por-hora'] });
        },
    });
};

export {
    useAccesosPorHora,
    useInsertAccesoPorHora,
    useUpdateAccesoPorHora,
    useDeleteAccesoPorHora
};
