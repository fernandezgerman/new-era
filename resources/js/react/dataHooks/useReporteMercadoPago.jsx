import {useQuery} from '@tanstack/react-query';
import MovimientosCaja from '@/resources/MovimientosCaja.jsx';

const resource = new MovimientosCaja();

export const useReporteMercadoPago = ({
    filters,
    enabled = true,
}) => {
    return useQuery({
        queryKey: ['reporte-mercado-pago', filters],
        queryFn: () => resource.getReporteMercadoPago(filters),
        enabled: enabled && filters != null,
        staleTime: 1000 * 60 * 60,
    });
};
