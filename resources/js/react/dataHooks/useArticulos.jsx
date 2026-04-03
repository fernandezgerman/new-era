
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";

const useArticulo = (idarticulo) => {
    return useQuery({
        queryKey: ['get-articulo-'+ idarticulo],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntity('articulo', idarticulo);
        },
        enabled: !!idarticulo,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 1, // 24 hours
    });

}

export { useArticulo };
