import React, {useEffect} from 'react';
import {CustomModal} from "@/components/Modal.jsx";
import {LabelError} from "@/components/Label.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {useAlertaSucursalInicioLiquidacion} from "@/dataHooks/useAlertaSucursalInicioLiquidacion.jsx";
import {useSucursal} from "@/dataHooks/useSucursales.jsx";
import {processDate} from "@/utils/dates.jsx";
import moment from "moment";
import {PageHeader} from "@/components/H.jsx";
import {MovimientoDeCaja} from "@/widgets/MovimientoDeCaja/index.jsx";
import {map} from 'lodash';


const AlertaRender = ({movimientos, tipo})=> {

    return <>
    {tipo === 'movimientosCaja' && movimientos && movimientos?.map((movimiento) => <MovimientoDeCaja movimiento={movimiento}/>)}
    </>;
}
export const ShowSucursalAlertasLiquidacion = ({payload}) => {

    const [errorMessage, setErrorMessage] = React.useState(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [idSucursal, setIdSucursal] = React.useState(null);

    const {data: alertas, isLoading} = useAlertaSucursalInicioLiquidacion({sucursalId: idSucursal})
    const {data: sucursal} = useSucursal(idSucursal)

    useEffect(() => {
        console.log('payload from component', payload)
        if(!payload) return;
        setIdSucursal(payload.idSucursal);
        setIsOpen(true);
    }, [payload]);


    const DisplayUpdatedAt = <div content={'ml-auto '}>
        {alertas?.fechaHora && processDate(moment(alertas.fechaHora),false, true )}
    </div>

    return (<ErrorBoundary>
            <CustomModal
                widthEnPX={'l'}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                copete={''}
                cancelButtonVisible={false}
                onAceptar={() => {
                    setIsOpen(false);
                }}
            >
                <PageHeader>
                    <div className={'flex justify-between'}>
                        <div>{(sucursal?.nombre ?? '')}</div>
                        {DisplayUpdatedAt}
                    </div>
                </PageHeader>

                <div>
                    {alertas?.content && map(alertas.content, (alerta, index) => <AlertaRender movimientos={alerta} tipo={index}/>)}
                </div>
            </CustomModal>
        </ErrorBoundary>
    );

}
