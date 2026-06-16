import React from "react";

export const DashboardCard = ({children, className}) => {
    return <div className={'p-4 ne-dark-body rounded-lg '+className}>
        {children}
        </div>;
}

