import Resource from '@/resources/Resource.jsx';
import {useQuery} from '@tanstack/react-query';

export const useMarcas = () => {
    return useQuery({
        queryKey: ['marcas-activas'],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntities('marca', [], {activo: true}, 'marcas.nombre');
        },
        staleTime: 1000 * 60 * 60 * 24,
    });
};
