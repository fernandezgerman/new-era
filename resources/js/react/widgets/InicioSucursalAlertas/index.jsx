import ReactDOM from 'react-dom/client';
import React from 'react';
import {useMedioDeCobroSucursalConfiguracion} from "@/dataHooks/useMedioDeCobroSucursalConfiguracion.jsx";
import {faBox, faMoneyCheckAlt, faWarning} from "@fortawesome/free-solid-svg-icons";
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

    const tieneAlertas = alertas && alertas?.content?.movimientosCaja?.length > 0
        || alertas?.content?.transferenciasStock?.length > 0;

    const tieneMovimientosDinero = alertas && alertas?.content?.movimientosCaja?.length > 0;

    const tieneMovimientosStock = alertas && alertas?.content?.transferenciasStock?.length > 0;
    const onClick = () => {
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

        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: tieneAlertas ? 'orange' : 'black',

            height: '30px'
        }} onClick={onClick}>
            <div className={tieneAlertas ? '' : ''} style={{padding: '7px'}}>{sucursal?.nombre || 'Cargando...'} </div>
            {(tieneMovimientosDinero || tieneMovimientosStock) &&
                (<div style={{'display': 'flex', 'background-color': 'red', 'padding': '4px', 'borderRadius': '5px', 'height': '15px', 'margin': '3px'}}>
                    {tieneMovimientosDinero && (<div style={{'cursor': 'pointer', 'fontSize': '15px'}}>
                        <FontAwesomeIcon icon={faMoneyCheckAlt}/>
                    </div>)}
                    {tieneMovimientosStock && (<div style={{'cursor': 'pointer', 'fontSize': '15px'}}>
                        <FontAwesomeIcon  icon={faBox}/>
                    </div>)}
                </div>)}
        </div>);

}
