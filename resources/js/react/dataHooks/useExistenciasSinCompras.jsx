import {useQuery} from '@tanstack/react-query';
import ArticulosResource from '@/resources/Articulos.jsx';
import {buildExistenciasSinComprasParams} from '@/pages/ExistenciasSinCompras/existenciasSinComprasUtils.jsx';

const resource = new ArticulosResource();

export const useExistenciasSinCompras = ({
    filters,
    page = 1,
    enabled = true,
}) => {
    const params = buildExistenciasSinComprasParams(filters, page);

    return useQuery({
        queryKey: ['existencias-sin-compras', params],
        queryFn: () => resource.getNoComprados(params),
        enabled: enabled && filters != null && Number.isFinite(filters?.diasUltimaCompra) && filters.diasUltimaCompra >= 1,
        staleTime: 1000 * 60,
    });
};
