import {useQuery} from '@tanstack/react-query';
import MovimientosCaja from '@/resources/MovimientosCaja.jsx';
import {MOVIMIENTOS_CAJA_PER_PAGE} from '@/pages/ListadoMovimientosDeCaja/reporteMovimientosCajaUtils.jsx';

const resource = new MovimientosCaja();

export const useReporteMovimientosCaja = ({
    filters,
    page = 1,
    enabled = true,
}) => {
    return useQuery({
        queryKey: ['reporte-movimientos-caja', filters, page],
        queryFn: () => resource.getReporteMovimientosCaja({
            filtros: filters,
            page,
            perPage: MOVIMIENTOS_CAJA_PER_PAGE,
        }),
        enabled: enabled && filters != null,
        staleTime: 1000 * 60 * 5,
    });
};
