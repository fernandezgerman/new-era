import {useQuery} from "@tanstack/react-query";
import Dashboard from "../../resources/Dashboard.jsx";

const useLeftMenu = () => {
    return useQuery({
        queryKey: ['usuario-logueado-get-left-menu'],
        queryFn: async () => {
            const dashboardResources = new Dashboard();
            return await dashboardResources.leftMenu()
        },
        enable: true,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}

export { useLeftMenu };
