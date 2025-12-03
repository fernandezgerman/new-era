import React from "react";

const Label = ({children}) => {
    return(
        <lavel className={'italic font-semibold text-sm'}>
            {children}
        </lavel>);
}

const LabelError = ({children, className}) => {
    return(
        <div className={'italic font-semibold text-sm text-red-500 ' + className}>
            {children}
        </div>);
}

const LabelSuccess = ({children, className}) => {
    return(
        <div className={'italic font-semibold text-sm text-green-700 ' + className}>
            {children}
        </div>);
}

export { Label, LabelError, LabelSuccess };
