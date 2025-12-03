import React from "react";

const LegacyDivContainer = ({children, className = ''}) => {
    return <div className={" block w-full rounded-md mb-2 h-auto p-2 ne-dark-body " + className}>{children}</div>;
}

export { LegacyDivContainer };
