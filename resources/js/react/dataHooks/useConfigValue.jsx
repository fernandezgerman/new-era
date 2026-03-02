import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";
import Config from "@/resources/Config.jsx";

const useConfigValue = ({ key }) => {
    return useQuery({
        queryKey: ['config-value-'+key],
        queryFn: async () => {
            const resource = new Config();
            return await resource.getValue(key);
        },
        enabled: true,
        staleTime: 1000 * 60 * 60 * 1, // 24 hours
    });

}

export { useConfigValue};
