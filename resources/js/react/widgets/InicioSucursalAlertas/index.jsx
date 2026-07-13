import ReactDOM from 'react-dom/client';
import React from 'react';
import {useMedioDeCobroSucursalConfiguracion} from "@/dataHooks/useMedioDeCobroSucursalConfiguracion.jsx";
import { faWarning} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CustomModal} from "@/components/Modal.jsx";
import MovimientosCaja from "@/resources/MovimientosCaja.jsx";
import {useSucursal} from "@/dataHooks/useSucursales.jsx";
import {useAlertaSucursalInicioLiquidacion} from "@/dataHooks/useAlertaSucursalInicioLiquidacion.jsx";
export const InicioSucursalAlertas = ({idSucursal}) => {
    const [errorMessage, setErrorMessage] = React.useState(null);

    const {data: sucursal} = useSucursal(idSucursal);

    const {data: alertas, isLoading} = useAlertaSucursalInicioLiquidacion({sucursalId: idSucursal})

    const loadData = () => {
        const resource = new MovimientosCaja();

        return resource.movimientosCajaPendientesParaLiq(idsucursal);
    }

    const tieneAlertas = alertas && alertas?.content?.movimientosCaja?.length > 0;
    const onClick= () => {
        const mensaje = {
            tipo: 'IFRAME_EVENT',
            accion: 'INICIO_SUCURSAL_ALERTAS_LIQUIDACION',
            payload: {
                idSucursal: idSucursal
            }
        };

        // Obtiene: https://sitio.com
        const baseUrl = window.location.origin;

        // Enviar mensaje al padre (React)
        window.parent.postMessage(mensaje, baseUrl); // Cambia por tu dominio en producción

    }
    return (

        <div style={{display: 'flex', justifyContent: 'space-between', backgroundColor: tieneAlertas ? 'orange' : 'black', padding: '5px', height: '20px'}}>
            <span className={tieneAlertas ? 'blink' : ''}> {sucursal?.nombre || 'Cargando...'} </span>
            {tieneAlertas && (<div style={{'cursor': 'pointer','fontSize': '17px'}} >
                 <FontAwesomeIcon onClick={onClick} icon={faWarning} />
            </div>)}
        </div>);

}
