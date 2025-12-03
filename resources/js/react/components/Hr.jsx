import React from "react";

export const Hr = ({className = ''}) => {
    return <hr className={"h-px my-8 bg-black border-0 dark:!bg-white " + className}/>;
}

export const HrSx = ({className = ''}) => {
    return <hr className={"h-px my-3 bg-black border-0 dark:!bg-white " + className}/>;
}


export const HrSoft = ({className = ''}) => {
    return <hr className={"h-px mx-0 my-4 bg-transparent border-0 opacity-25 bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent " + className}/>;
}
