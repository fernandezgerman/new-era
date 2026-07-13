
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";
import Authentication from "../resources/Authentication.jsx";
import Cajas from "@/resources/Cajas.jsx";
import Liquidaciones from "@/resources/Liquidaciones.jsx";
import Dashboard from "@/resources/Dashboard.jsx";

const useAlertaSucursalInicioLiquidacion = ({sucursalId}) => {
    return useQuery({
        queryKey: ['getAlertaSucursalInicioLiquidacion-' + sucursalId],
        queryFn: async () => {
            const resource = new Dashboard();
            return await resource.getAlertaSucursalInicioLiquidacion(sucursalId);
        },
        enabled: !!sucursalId,
        select: (data) => data,
        staleTime: 1000 * 60 * 15 , // 15 minutos
    });

}

export { useAlertaSucursalInicioLiquidacion };
