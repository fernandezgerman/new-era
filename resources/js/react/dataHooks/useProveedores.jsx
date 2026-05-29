import Resource from '@/resources/Resource.jsx';
import {useQuery} from '@tanstack/react-query';

export const useProveedores = () => {
    return useQuery({
        queryKey: ['proveedores-lista'],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntities('proveedor', [], null, 'proveedores.nombre', 5000);
        },
        staleTime: 1000 * 60 * 60,
    });
};
