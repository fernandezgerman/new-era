import Resource from '@/resources/Resource.jsx';
import {useQuery} from '@tanstack/react-query';

export const useMotivosMovimientosCaja = () => {
    return useQuery({
        queryKey: ['motivos-movimientos-caja-activos'],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntities(
                'MotivoMovimientoCaja',
                [],
                {activo: 1},
                'descripcion',
            );
        },
        staleTime: 1000 * 60 * 60 * 24,
    });
};
