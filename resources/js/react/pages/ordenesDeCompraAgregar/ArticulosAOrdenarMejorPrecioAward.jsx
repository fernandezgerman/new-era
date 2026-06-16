import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAward} from '@fortawesome/free-solid-svg-icons';

export const ArticulosAOrdenarMejorPrecioAward = ({className = '', title = 'Mejor precio'}) => {
    return (
        <span
            title={title}
            className={
                'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[10px] text-amber-950 '
                + className
            }
        >
            <FontAwesomeIcon icon={faAward} />
        </span>
    );
};
