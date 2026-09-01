import {useQuery} from '@tanstack/react-query';
import Resource from '@/resources/Resource.jsx';

export const usePromocion = (promocionId) => {
    return useQuery({
        queryKey: ['promocion', promocionId],
        queryFn: async () => {
            const resource = new Resource();
            return resource.getEntity('promocion', promocionId);
        },
        enabled: !!promocionId,
        staleTime: 1000 * 60 * 5,
    });
};

export const usePromocionArticulos = (promocionId) => {
    return useQuery({
        queryKey: ['promocion-articulos', promocionId],
        queryFn: async () => {
            const resource = new Resource();
            return resource.getEntities(
                'promocionArticulo',
                ['articulo'],
                {
                    idpromocion: promocionId,
                    activo: 1,
                },
                {orden1: {name: 'id', direction: 'asc'}},
                5000,
            );
        },
        enabled: !!promocionId,
        staleTime: 1000 * 60 * 5,
    });
};
