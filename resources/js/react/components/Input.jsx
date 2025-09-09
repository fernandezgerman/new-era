import React from "react";

const Input = ({placeHolder = '', value, type = 'text', setValue}) => {
    return(
    <input
        type={type}
        placeholder={placeHolder}
        onChange={(e) => setValue(e.target.value)}
        className="focus:shadow-soft-primary-outline dark:ne-dark-input dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
        value={value}
    />);
}

export { Input };
