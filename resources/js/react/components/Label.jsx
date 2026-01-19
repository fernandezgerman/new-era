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

const LabelAddNumberSign = ({number, symbol, decimales = 2}) => {

    const textToFormat = parseFloat(Math.abs(number)).toFixed(decimales);

    return number < 0 ? '-' + symbol + textToFormat :  symbol + textToFormat;
}
const LabelBySign = ({number, className, symbol = '', decimales = 2}) =>
{
    const colour = number < 0 ? ' text-red-500! ' : ' text-green-700 ';

    return(
        <div className={'italic font-semibold text-sm ' + colour + className}>
            <LabelAddNumberSign number={number} symbol={symbol} />
        </div>);
}

export { Label, LabelError, LabelSuccess, LabelBySign,LabelAddNumberSign };
