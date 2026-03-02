import React from "react";
import {IconButton} from "@/components/Buttons.jsx";
import {faAdd, faBackward, faCopy, faRefresh, faSyncAlt} from "@fortawesome/free-solid-svg-icons";

export const H2 = ({children, className}) => {
    return <span className={"text-[18px] font-bold text-gray-800 dark:text-white " + className}>
       {children}
    </span>;
}


export const H1 = ({children}) => {
    return <span className="text-[22px] font-bold text-pink-500 dark:color-pink-500 bold ">
       {children}
    </span>;
}

export const H3 = ({className, children}) => {
    return <div className={"text-[16px] font-semibold text-gray-800 dark:text-white mb-2 " + className}>
        {children}
    </div>;
}

export const AddIconButton = ({onAdd, className, loading}) => {
    return <IconButton loading={loading} onClick={onAdd}
                       className={'float-right align-middle text-center text-lg bold justify-center ' + className}
                       icon={faAdd}/>;
}

export const RefreshIconButton = ({onRefresh, className, loading}) => {

    return <IconButton
        loading={loading} onClick={onRefresh}
        className={'float-right align-middle text-center text-lg bold justify-center ' + className}
        iconClassName={loading ? ' animate-spin ' : ''}
        icon={faSyncAlt}/>;
}

export const BackIconButton = ({onBack, className, loading}) => {

    return <IconButton
        loading={loading} onClick={onBack}
        className={'float-right align-middle text-center text-lg bold justify-center ' + className}
        iconClassName={loading ? ' animate-spin ' : ''}
        icon={faBackward}/>;
}

export const PageHeader = ({children, onAdd, onRefresh,onBack, loading}) => {
    return <div className={'justify-center w-full align-middle bg-[#282828] dark:bg-white rounded-xl p-2 pl-6'}>
        <H1>{children}</H1>
        {onAdd && <AddIconButton loading={loading} onAdd={onAdd} className={'  p-1! px-1.5! '}/>}
        {onRefresh && <RefreshIconButton loading={loading} onRefresh={onRefresh} className={'  p-1! px-1.5! '}/>}
        {onBack && <BackIconButton loading={loading} onBack={onBack} className={'  p-1! px-1.5! '}/>}


    </div>;
}
