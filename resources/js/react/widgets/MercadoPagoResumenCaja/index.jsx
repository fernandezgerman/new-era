import ReactDOM from 'react-dom/client';
import React from 'react';
import {useMedioDeCobroSucursalConfiguracion} from "@/dataHooks/useMedioDeCobroSucursalConfiguracion.jsx";
import {faListAlt, faMagnifyingGlassDollar, faUsersViewfinder} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CajaDetalle} from "@/widgets/CajaDetalle/index.jsx";
import {CustomModal} from "@/components/Modal.jsx";
import {LabelError} from "@/components/Label.jsx";
import {TimeLine} from "@/components/TimeLine.jsx";
export const MercadoPagoResumenCaja = ({idUsuario,idSucursal, numeroCaja, setIsOpen, isOpen}) => {
    const [errorMessage, setErrorMessage] = React.useState(null);

    const {data: medioDeCobroSucursalConfiguracion, isLoading, refetch} = useMedioDeCobroSucursalConfiguracion(idSucursal, idUsuario);

    return isLoading || !medioDeCobroSucursalConfiguracion ? '' :
        <div>
            <FontAwesomeIcon onClick={() => setIsOpen(true)} icon={faListAlt} className={'cursor-pointer text-white text-2xl'} />

            <CustomModal
                widthEnPX={'l'}
                className={'h-[85vh]! max-w-[calc(60vw)]'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                cancelButtonVisible={false}
                onAceptar={() => {
                    setIsOpen(false);
                }}
            >
                {errorMessage && <LabelError className={'ml-2'}>{errorMessage}</LabelError>}
                <CajaDetalle  numeroCaja={numeroCaja} idUsuario={idUsuario} idSucursal={idSucursal} />
            </CustomModal>



        </div>;

}
