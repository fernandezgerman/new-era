import React from "react";

export const ErrorDisplayer = ({errorDescription, className}) => {
    return <>
        {errorDescription && (
            <div className={"text-red-600 text-sm mb-4 " + className}>{errorDescription}</div>
        )}
    </>;
}
export const InLineLabel = ({text, className}) => {
    return <>
        {text && (
            <span className={"font-bold uppercase text-slate-400 text-xs opacity-70 " + className}>{text}</span>
        )}
    </>;
}
