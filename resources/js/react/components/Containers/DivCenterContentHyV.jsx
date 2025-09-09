import React from "react";

const DivCenterContentHyV = ({children, className}) => {
    return <div className={"flex justify-center h-screen " + className}>{children}</div>;
}

export { DivCenterContentHyV };
