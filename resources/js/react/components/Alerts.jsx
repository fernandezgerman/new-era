import React from "react";
import {get} from "lodash";
const colors = {
    success: 'bg-lime-500',
    danger: 'bg-red-500',
    neutral: 'bg-slate-700',
    new_era: 'bg-fuchsia-500',
    disabled: 'bg-slate-400',
}
export const Alert = ({children, color = 'default'}) => {
    const colorClass = get(colors,color) ?? ' bg-yellow-400 ';
    return <div className={"relative w-full mt-2 p-4 text-white rounded-lg "+colorClass}>{children}</div>;
}
export const AlertDanger = ({children}) => {
    return <Alert color={'danger'} >{children}</Alert>;
}

export const AlertSuccess = ({children}) => {
    return <Alert color={'success'} >{children}</Alert>;
}

export const AlertNeutral = ({children}) => {
    return <Alert color={'neutral'} >{children}</Alert>;
}

export const AlertNewEra = ({children}) => {
    return <Alert color={'new_era'} >{children}</Alert>;
}

export const AlertDisabled = ({children}) => {
    return <Alert color={'disabled'} >{children}</Alert>;
}
