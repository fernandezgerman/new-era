import {useQuery} from "@tanstack/react-query";
import Dashboard from "../../resources/Dashboard.jsx";

const useAlertas = () => {
    return useQuery({
        queryKey: ['usuario-logueado-get-alertas'],
        queryFn: async () => {
            const dashboardResources = new Dashboard();
            return await dashboardResources.getAlertas()
        },
        enable: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 2 , // 2 min
    });

}

const getAlertaDetallesQueryKey = (alertaId) => ('usuario-logueado-get-alerta-detalles-'+alertaId);
const useAlertaDetalles = (alertaId) => {
    return useQuery({
        queryKey: [getAlertaDetallesQueryKey(alertaId)],
        queryFn: async () => {
            const dashboardResources = new Dashboard();
            return await dashboardResources.getAlertaDetalle(alertaId)
        },
        enable: !!alertaId,
        select: (data) => data,
        staleTime: 1000 * 60 * 2 , // 2 min
    });

}

export { useAlertas, useAlertaDetalles, getAlertaDetallesQueryKey };
