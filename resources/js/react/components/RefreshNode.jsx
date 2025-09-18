import React from "react";
import {faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";



export const RefreshNode = ({onRefresh, children, loading, className,refreshButtonFirst = false, buttonClass= '', text = ''}) => {

    const refreshButton = (
        <div className={'mt-1.5 cursor-pointer opacity-100 ' + buttonClass}>
            <button onClick={onRefresh}>
                {text} <FontAwesomeIcon icon={faSyncAlt} className={loading ? 'animate-spin ' : ''} />
            </button>
        </div>
    );

    return <div className={(loading ? ' opacity-25 ': '') + className}>
        {refreshButtonFirst && refreshButton}
        {children}
        {!refreshButtonFirst && refreshButton}
    </div>;
}
