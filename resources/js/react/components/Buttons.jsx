import React from "react";

const ButtonSuccess = ({children, type = 'button', disabled = false, onClick}) => {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={"inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-gradient-to-tl bg-pink-500 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 " + (disabled ? "opacity-60 cursor-not-allowed" : "")}
        >
            {children}
        </button>
    );
}

export { ButtonSuccess };
