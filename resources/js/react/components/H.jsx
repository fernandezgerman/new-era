import React from "react";
import {Hr} from "@/components/Hr.jsx";
export const H2 = ({children}) => {
    return <span className="text-[18px] font-bold text-gray-800 dark:text-white ">
       {children}
    </span>;
}

export const H3 = ({children}) => {
    return <div className="text-[16px] font-semibold text-gray-800 dark:text-white mb-2">
       {children}
    </div>;
}
