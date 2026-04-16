import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faPencil, faTrash, faTrashRestore} from "@fortawesome/free-solid-svg-icons";
import {Button as Bf } from "flowbite-react";
import {CustomModal} from "@/components/Modal.jsx";

const Button = ({
                           children,
                           type = 'button',
                           disabled = false,
                           onClick,
                           className = '',
                           format = 'normal',
}) => {

    const baseClass = () => {
        switch (format)
        {
            case 'xxs':
                return ' px-1 py-0.5 text-[5px] w-auto ';
            case 'xs':
                return ' px-3 py-1.5 text-[8px] w-auto ';
            case 'normal':
                return ' bg-pink-500  '
            default:
                return ' px-6 py-3 text-xs bg-pink-500 ';
        }
    }
    return (
        <Bf
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={"inline-block w-auto mt-6 mb-0 font-bold text-center text-white uppercase align-middle border-0 rounded-lg cursor-pointer " + (disabled ? "opacity-60 cursor-not-allowed " : "") + baseClass() + ' ' + className}
        >
            {children}
        </Bf>
    );
}

const AceptarButton = ({
                    children,
                    type = 'button',
                    disabled = false,
                    onClick,
                    className = '',
                    format = 'normal',
                }) => {

   return <Button
       className={'text-white! ' + className}
       type={type}
       disabled={disabled}
       onClick={onClick}
       format={format}

   >
       {children}</Button>
}

const CancelarButton = ({
                            children,
                            type = 'button',
                            disabled = false,
                            onClick,
                            className = '',
                            format = 'normal',
                        }) => {

    return <Button
        className={' bg-gray-400! text-gray-900! ' + className}
        type={type}
        disabled={disabled}
        onClick={onClick}
        format={format}

    >
        {children}</Button>
}
const IconButton = ({icon, className, onClick, iconClassName}) => {
    return <span className={'mr-1 p-1 bg-pink-500 text-white rounded-lg cursor-pointer ' + className} onClick={onClick}><FontAwesomeIcon className={iconClassName} icon={icon} /></span>
}

const EditIconButton = ({className, onClick}) => {
    return <IconButton icon={faPencil} className={className} onClick={onClick} />
}
const ViewIconButton = ({className, onClick}) => {
    return <IconButton icon={faMagnifyingGlass} className={className} onClick={onClick} />
}

const DeleteIconButton = ({className, onClick, restore = false, withConfirmation = false, confirmationTitle = ' Esta seguro que desea eliminar?'}) => {

    const [desicion, setDesicion] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const _onClick = () =>
    {
        if(withConfirmation)
        {
            setShowModal(true);
        }else{
            onClick();
        }
    }

    return <>
        <CustomModal
            onAceptar={onClick}
            isOpen={showModal}
            setIsOpen={setShowModal}
            copete={confirmationTitle}
            titulo={'Eliminar'}
            widthEnPX={'s'}
        />
        <IconButton icon={restore ? faTrashRestore : faTrash} className={(restore ? ' bg-green-500! ' : ' bg-red-500 ') + className} onClick={_onClick} />
        </>
}

export { ViewIconButton, Button, EditIconButton, IconButton, CancelarButton, AceptarButton, DeleteIconButton};
