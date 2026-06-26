import React from "react";
import {get} from "lodash";

export const A = ({children, href, target, className}) => {

    return <a className={'underline text-pink-500! dark:text-pink-200! ' + className} href={href} target={target}>
        {children}
    </a>;
}
