import Resource from '@/resources/Resource.jsx';
import {useQuery} from '@tanstack/react-query';

export const useArticulosRubroGastos = () => {
    return useQuery({
        queryKey: ['articulos-rubro-gastos'],
        queryFn: async () => {
            const resource = new Resource();
            const rubros = await resource.getEntities('rubro', [], {esrubrogastos: 1}, 'rubros.nombre');
            const rubroIds = new Set((rubros ?? []).map((r) => parseInt(r.id, 10)));
            if (rubroIds.size === 0) {
                return [];
            }
            const articulos = await resource.getEntities(
                'articulo',
                ['rubro'],
                {activo: 1},
                'articulos.nombre',
                5000,
            );
            return (articulos ?? []).filter((a) => {
                const idRubro = parseInt(a?.idrubro ?? a?.rubro?.id, 10);
                return rubroIds.has(idRubro) || a?.rubro?.esrubrogastos === 1 || a?.rubro?.esrubrogastos === '1';
            });
        },
        staleTime: 1000 * 60 * 60,
    });
};
