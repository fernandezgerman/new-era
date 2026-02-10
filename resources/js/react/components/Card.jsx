import React from "react";
import {H2} from "@/components/H.jsx";
import {faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Card = ({loading, children, title, titleClassName = '', childrenClassName = '', onRefresh = null, className}) => {

    const overlayDiv = (<div
        className={'rounded-2xl absolute top-0 left-0 w-full h-full opacity-50 bg-gray-300 z-999 '}
        style={{
            cursor: 'not-allowed',
        }}
    />);

    return (<div
        className={" relative flex flex-col min-w-0 break-words  border-0 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border dark:ne-dark-card dark:shadow-soft-dark-xl mt-2 " + className}>
        {loading && overlayDiv}
        <div className="p-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
            <div className="flex flex-wrap -mx-3">
                <div className="flex items-center w-full max-w-full px-3 shrink-0 md:w-8/12 md:flex-none">
                    <div
                        className={"mb-0 text-[18px] font-bold text-gray-800 dark:text-white underline  " + titleClassName}>
                        {title}
                        {onRefresh !== null && <FontAwesomeIcon icon={faSyncAlt} className={' absolute right-3 cursor mt-2 ' + (loading ? ' animate-spin ' : '')} onClick={onRefresh} />}
                        {loading && onRefresh === null && (<FontAwesomeIcon icon={faSyncAlt} className={'animate-spin absolute right-3 '}/>)}
                    </div>
                </div>
            </div>
        </div>
        <div className={"flex-auto p-4 text-gray-800 dark:text-white " + childrenClassName}>
            {children}
        </div>
    </div>);
}
export const CardTitleWithImage = ({image, title, paragraph}) => {

    return (
        <div className="flex">
            <div
                className="w-auto h-19 text-base ease-soft-in-out bg-gradient-to-tl from-blue-300 to-blue-350 dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 inline-flex items-center justify-center rounded-lg p-2 text-white transition-all duration-200">
                <img className="w-19" src={image} alt="Image placeholder"/>
            </div>
            <div className="my-auto ml-4">
                <h6 className="dark:text-white">{title}</h6>

            </div>
        </div>);
}

export const SubCard = ({children}) => {
    return <ul className="flex flex-col pl-0 mb-0 rounded-lg">
            <li className="relative p-6 mb-2 border-0 rounded-t-inherit rounded-xl bg-gray-100 dark:dark:bg-gray-900">
                {children}
            </li>
    </ul>;
}
