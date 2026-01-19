import React from "react";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Button = ({
                           children,
                           type = 'button',
                           disabled = false,
                           onClick,
                           className = '',
                           format = 'normal',
                           color = 'primary',
}) => {

    const baseClass = () => {
        switch (format)
        {
            case 'xs':
                return ' px-3 py-1.5 text-[8px] w-auto bg-gray-500 ';
            default:
                return ' px-6 py-3 text-xs bg-pink-500';
        }
    }
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={"inline-block w-auto mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-gradient-to-tl  leading-pro  ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 " + (disabled ? "opacity-60 cursor-not-allowed " : "") + className + baseClass()}
        >
            {children}
        </button>
    );
}

const IconButton = ({icon, className, onClick}) => {
    return <span className={'mr-1 p-1 bg-pink-500 rounded-lg cursor-pointer ' + className} onClick={onClick}><FontAwesomeIcon icon={icon} /></span>
}

const EditIconButton = ({className, onClick}) => {
    return <IconButton icon={faPencil} className={className} onClick={onClick} />
}

export { Button, EditIconButton, IconButton };
