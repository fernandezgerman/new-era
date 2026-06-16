import React, {useState} from 'react';
import {faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Chip = ({children, className, loading}) => {
    return (<div className={' p-0.5 px-2 mt-1 text-[12px] w-fit rounded-2xl ' + className}>
        {children}{loading && (<FontAwesomeIcon icon={faSyncAlt} className={'animate-spin '}/>)}
    </div>);
}
export const ChipBlue = ({children, className, loading}) => {
    return (<Chip loading={loading} className={' bg-blue-500 text-white ' + className}>
        {children}
    </Chip>);
}

export const ChipRed = ({children, className, loading}) => {
    return (<Chip loading={loading} className={' bg-red-500 text-white ' + className}>
        {children}
    </Chip>);
}


export const ChipGreen = ({children, className, loading}) => {
    return (<Chip loading={loading} className={' bg-green-500 text-white ' + className}>
        {children}
    </Chip>);
}
export const ChipYellow = ({children, className, loading}) => {
    return (<Chip loading={loading} className={' bg-yellow-200 text-black ' + className}>
        {children}
    </Chip>);
}

export const ChipOrange = ({children, className, loading}) => {
    return (<Chip loading={loading} className={' bg-orange-400 text-white ' + className}>
        {children}
    </Chip>);
}
