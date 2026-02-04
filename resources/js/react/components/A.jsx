import React from "react";
import {get} from "lodash";

export const A = ({children, href, target}) => {

    return <a className={'underline text-fuchsia-200'} href={href} target={target}>
        {children}
    </a>;
}
