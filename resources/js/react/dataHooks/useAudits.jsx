import {useQuery} from "@tanstack/react-query";
import Resource from "../resources/Resource.jsx";
import {filter as filterLodash} from 'lodash';

const useAudits = (includes = [], filter = {}, cacheKey = null, limit = 100) => {
    return useQuery({
        queryKey: [cacheKey ?? ('audits-' + JSON.stringify(includes) + JSON.stringify(filter)) + 'l-' + limit],
        queryFn: async () => {
            const resource = new Resource();
            // Assuming the backend handles limit, or it returns all and we limit in frontend.
            // For now, let's fetch based on filters.
            return await resource.getEntities('audit', includes, filter, {orden1: {name: 'created_at', direction: 'desc'}}, limit);
        },
        enabled: (filter?.user_id > 0 && filter?.created_at?.valor !== null),
        select: (data) => data,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export { useAudits };
