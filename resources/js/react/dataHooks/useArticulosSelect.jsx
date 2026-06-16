import Resource from '@/resources/Resource.jsx';
import {useQuery} from '@tanstack/react-query';

export const useArticulosSelect = () => {
    return useQuery({
        queryKey: ['articulos-select-activos'],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntities(
                'articulo',
                ['rubro'],
                {activo: 1},
                'articulos.nombre',
                5000,
            );
        },
        staleTime: 1000 * 60 * 60,
    });
};
