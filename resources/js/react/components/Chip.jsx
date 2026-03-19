import React, {useState} from 'react';
export const Chip = ({children, className}) => {
    return (<div className={' p-0.5 px-2 mt-1 text-[12px] w-fit rounded-2xl ' +className}>
        {children}
    </div>);
}
export const ChipBlue = ({children, className}) => {
    return (<Chip className={' bg-blue-500 text-white ' + className} >
        {children}
    </Chip>);
}

export const ChipRed = ({children, className}) => {
    return (<Chip className={' bg-red-500 text-white ' + className} >
        {children}
    </Chip>);
}

export const ChipGreen = ({children, className}) => {
    return (<Chip className={' bg-green-500 text-white ' + className} >
        {children}
    </Chip>);
}

