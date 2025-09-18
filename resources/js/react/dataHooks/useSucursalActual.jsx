import {useQuery} from "@tanstack/react-query";
import Authentication from "../resources/Authentication.jsx";

const useSucursalActual = () => {
    return useQuery({
        queryKey: ['authentication-sucursal-actual'],
        queryFn: async () => {
            const authentication = new Authentication();
            return await authentication.getSucursalActual();
        },
        enabled: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { useSucursalActual };
