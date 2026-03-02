import React from "react";
import Modal from 'react-modal';
import {H2} from "@/components/H.jsx";
import {AceptarButton, Button, CancelarButton} from "@/components/Buttons.jsx";

export const CustomModal = ({
                                isOpen, setIsOpen, children, titulo = "",
                                afterOpenModal = null,
                                widthEnPX = 'md',
                                copete = null,
                                footer = undefined,
                                onAceptar = () => {
                                },
                                loading
                            }) => {

    const size = () => {
        if (widthEnPX === 'md') return ' ml-[calc(50%-300px)]  w-[600px] ';
        if (widthEnPX === 's') return ' ml-[calc(50%-200px)]  w-[400px] ';
        if (widthEnPX === 'xs') return ' ml-[calc(50%-100px)]  w-[200px] ';
        if (widthEnPX === 'l') return ' ml-[calc(50%-400px)]  w-[800px] ';
        if (widthEnPX === 'lg') return ' ml-[calc(50%-500px)]  w-[1000px] ';
        if (widthEnPX === 'xl') return ' ml-[calc(50%-600px)]  w-[1200px] ';
    }

    const loadingClass = loading ? ' opacity-60 ' : ''
    return (<Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModal}
        contentLabel={titulo}
        className={'  mt-20  rounded-xl ne-body dark:ne-dark-body p-5 px-10 ' + size() + loadingClass}
    >
        <div className={'relative '}>
            <H2>{titulo}</H2>
            {copete && (<div className={'mt-5'}>{copete}</div>)}
            <div className={'mt-8 h-full relative'}>
                {children}
            </div>
            <div className={' justify-end flex'}>
                {footer !== undefined && footer}
                {footer === undefined && (<>
                    <CancelarButton disabled={loading} onClick={() => setIsOpen(false)} className={'mr-2'}>Cancelar</CancelarButton>
                    <AceptarButton disabled={loading} onClick={onAceptar}>Aceptar</AceptarButton>
                </>)}
            </div>
        </div>

    </Modal>);
}
