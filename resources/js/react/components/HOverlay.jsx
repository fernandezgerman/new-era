import React from "react";
import {Hr} from "@/components/Hr.jsx";

export const H02 = ({children}) => {
    return <span className="text-[18px] font-bold text-gray-800 dark:text-white ">
       {children}
    </span>;
}

export const HO2 = ({children, className}) => {
    return <div className={'w-full text-[22px] font-semibold p-3 dark:text-gray-800 mb-2  rounded-lg ne-dark-body dark:ne-body  ' + className}>
        {children}
    </div>;
}

export const HO3 = ({children, className}) => {
    return <div className={'w-full text-[18px] font-semibold p-3 dark:text-gray-800 mb-2  rounded-lg ne-dark-body dark:ne-body  ' + className}>
        {children}
    </div>;
}
