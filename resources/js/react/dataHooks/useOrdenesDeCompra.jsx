import {useQuery} from '@tanstack/react-query';
import OrdenesDeCompraResource from '@/resources/OrdenesDeCompra.jsx';
import {buildOrdenesDeCompraParams} from '@/pages/ordenesDeCompra/ordenesDeCompraUtils.jsx';

const resource = new OrdenesDeCompraResource();

export const useOrdenesDeCompra = ({
    filters,
    page = 1,
    sort,
    sortDirection,
    enabled = true,
}) => {
    const params = buildOrdenesDeCompraParams(filters, page, {sort, sortDirection});

    return useQuery({
        queryKey: ['ordenes-de-compra', params],
        queryFn: () => resource.getOrdenesDeCompra(params),
        enabled: enabled && !!filters?.fechaDesde && !!filters?.fechaHasta,
        staleTime: 1000 * 60,
    });
};
