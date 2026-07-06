import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {processNumber} from "@/utils/numbers.jsx";
import React from "react";

export const GeneraItemContainer = ({key, descripcion, importe, onClick, className}) => {

    const extraClass = onClick ? '' : 'px-6';
    return (
        <div key={key} className={' w-full bg-gray-200  p-3 flex justify-between items-center rounded mt-2 '+className}>
            <div className={extraClass}>
                {onClick && (<FontAwesomeIcon onClick={onClick} className={'cursor-pointer '} icon={faPlus} />)}
                {descripcion}
            </div>

            <div>{processNumber(importe, 2, false,'$')}</div>
        </div>
    )
}

export const GeneraSubItemContainer = ({key, descripcion, importe, onClick, className}) => {

    const extraClass = onClick ? '' : 'px-6';
    return (
        <div key={key} className={' w-full bg-gray-100  p-3 ml-6 flex justify-between items-center rounded mt-2 '+className}>
            <div className={extraClass}>
                {onClick && (<FontAwesomeIcon onClick={onClick} className={'cursor-pointer '} icon={faPlus} />)}
                {descripcion}
            </div>

            <div>{processNumber(importe, 2, false,'$')}</div>
        </div>
    )
}
