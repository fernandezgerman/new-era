import React from "react";
import {get} from "lodash";
const colors = {
    success: 'bg-lime-500',
    danger: 'bg-red-500',
    neutral: 'bg-slate-700',
    new_era: 'bg-fuchsia-500',
    disabled: 'bg-slate-400',
}
export const Alert = ({children, color = 'default', className}) => {
    const colorClass = get(colors,color) ?? ' bg-yellow-400 ';
    return <div className={"relative w-full mt-2 p-4 text-white rounded-lg "+colorClass+' '+className}>{children}</div>;
}
export const AlertDanger = ({children, className}) => {
    return <Alert color={'danger'} >{children}</Alert>;
}

export const AlertSuccess = ({children, className}) => {
    return <Alert color={'success'} className={className}>{children}</Alert>;
}

export const AlertNeutral = ({children, className}) => {
    return <Alert color={'neutral'}  className={className}>{children}</Alert>;
}

export const AlertNewEra = ({children, className}) => {
    return <Alert color={'new_era'} className={className} >{children}</Alert>;
}

export const AlertDisabled = ({children, className}) => {
    return <Alert color={'disabled'} className={className} >{children}</Alert>;
}
