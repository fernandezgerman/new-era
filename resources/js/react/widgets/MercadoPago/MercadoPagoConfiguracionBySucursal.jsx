import useSystemTheme from "@/utils/useSystemTheme.jsx";
import React, {useEffect, useRef, useState} from "react";
import {Checkbox} from "@/components/Checkbox.jsx";
import {H2, H3} from "@/components/H.jsx";
import {Card, CardTitleWithImage, SubCard} from "@/components/Card.jsx";
import {Input} from "@/components/Input.jsx";
import {Button} from "@/components/Buttons.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import mercadoPagoLogo from "../../../../img/mercado-pago-iso.png";
import {Select} from "@/components/Select.jsx";
import {useSucursales} from "@/dataHooks/useSucursales.jsx";
import uuid from "react-uuid";
import {
    getModoDeCobroSucursalConfiguracion, insertModoDeCobroSucursalConfiguracion,
    testToken, updateModoDeCobroSucursalConfiguracion
} from "@/dataAccess/ModoDeCobroSucursalConfiguracionDataAccess.jsx";
import {LabelError} from "@/components/Label.jsx";
import {AlertDanger, AlertSuccess} from "@/components/Alerts.jsx";
import {A} from "@/components/A.jsx";
import {TextDecorator} from "@/components/TextDecorator.jsx";

const AccionesEspeciales = ({
                                transferirMovimientos,
                                setTransferirMovimientos,
                                sucursalCaja,
                                setSucursalCaja,
                                usuarioCaja,
                                setUsuarioCaja
                            }) => {

    const [usuariosList, setUsuariosList] = useState([]);
    const {data: sucursales, refetch, isLoading, isRefetching} = useSucursales();

    useEffect(() => {
        if (sucursalCaja && sucursales) {
            const sucursalSeleccionada = sucursales.reduce((acum, sucursal) => sucursal.id === sucursalCaja ? sucursal : acum, null)
            setUsuariosList(sucursalSeleccionada ? sucursalSeleccionada.usuarios_cajas : []);
        } else {
            setUsuariosList([]);
        }
    }, [sucursalCaja, sucursales]);

    const selectUsuariosList = usuariosList.map((usuario) => ({
        key: uuid(),
        value: usuario.id,
        label: usuario.nombre + ' ' + usuario.apellido
    }));

    useEffect(() => {

        if(usuarioCaja && usuariosList && usuariosList.length > 0 && !usuariosList.reduce((exists, ul) => (usuarioCaja === ul.id || exists), false))
        {

            setUsuarioCaja(false);
        }
    }, [usuariosList]);

    return (<div className={''}>
        <H3>Acciones especiales</H3>
        <Checkbox label={'Transferir automaticamente cada cobro a:'}
                  value={transferirMovimientos}
                  className={' mb-4'} onChange={setTransferirMovimientos}/>

            {transferirMovimientos && (
                <>
                    <Select
                        options={sucursales?.map((sucursal) => ({key: uuid(), value: sucursal.id, label: sucursal.nombre}))}
                        value={sucursalCaja}
                        className={'mt-4'}
                        setValue={(sucursalId) => setSucursalCaja(parseInt(sucursalId))}
                        placeholder="Seleccione una sucursal"
                        label={'Sucursal'}
                    />
                    {sucursalCaja && (
                        <>
                            <Select
                                options={selectUsuariosList}
                                className={'mt-4'}
                                value={usuarioCaja}
                                setValue={setUsuarioCaja}
                                placeholder="Seleccione un usuario destinatario"
                                label={'Usuario'}
                            />
                        </>
                    )}

                    {!sucursalCaja && (
                        <div className={'mt-4'}> Seleccione una sucursal para ver los usuarios</div>
                    )}
                </>
            )}
    </div>);
}

const PanelConfiguracionChecked = ({originalData, checkMercadoPagoQRConfiguracion, errorMessage}) =>
{
    if(!(originalData?.id))
    {
        return '';
    }

    const ConfiguracionNoCheckeada = <AlertDanger>
        La configuracion no ha sido checkeada. El medio de pago no estará disponible hasta entonces.
        {errorMessage && ( <>
            <br /><b>{errorMessage}</b> <br />
        </>)}
        <Button format={'xs'} onClick={() => checkMercadoPagoQRConfiguracion(originalData.id)} >Checkear configuracion</Button>
    </AlertDanger>;

    const ConfiguracionCheckeada = <AlertSuccess>

        La configuracion ha sido checkeada correctamente. Todo listo para comenzar!
        <p className={'mt-3'}>
            Para imprimir QR:<br />
            <TextDecorator >
                <A target="_blank" href={originalData.local_qr_link}>{originalData.local_qr_link}</A>
            </TextDecorator>
        </p>
        <p className={'mt-3'}>
            Para configurar notificaciones en mercado pago, copie el siguiente link:<br />
            <TextDecorator >
                <A  target="_blank" href={originalData.web_hook_link}>{originalData.web_hook_link}</A>
            </TextDecorator >
        </p>
    </AlertSuccess>;


    return originalData.configuration_checked ? ConfiguracionCheckeada : ConfiguracionNoCheckeada;
}
export const MercadoPagoConfiguracionBySucursal = ({sucursalId, modoDeCobroId}) => {
    const darkMode = useSystemTheme();
    const [mercadoPagoHabilitado, setMercadoPagoHabilitado] = useState(false);
    const [transferirMovimientos, setTransferirMovimientos] = useState(false);
    const [sucursalCaja, setSucursalCaja] = useState(0);
    const [usuarioCaja, setUsuarioCaja] = useState(0);
    const [errorMessage, setErrorMessage] = useState(false);
    const [checkConfigurationErrorMessage, setCheckConfigurationErrorMessage] = useState(false);
    const [validMessage, setValidMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');
    const [originalData, setOriginalData] = useState(false);

    const loadDataFromDB =  (entity) => {
        setOriginalData(entity);

        setSucursalCaja(entity.idsucursalcajadestino ?? 0);
        setUsuarioCaja(entity.idusuariocajadestino ?? 0);
        setMercadoPagoHabilitado(entity.habilitarconfiguracion ?? false);
        setTransferirMovimientos(entity.transferirmonto ?? false);
        setToken(entity.metadata?.token ?? '');
        setUserId(entity.metadata?.userId ?? '');
    }

    useEffect(() => {
        getModoDeCobroSucursalConfiguracion({sucursalId, modoDeCobroId}).then((result) => {
            if(result &&  result?.length > 0)
            {
                const entity = result[0];
                loadDataFromDB(entity);
            }
        });
    }, [])

    const datosValidos = () => {
        setErrorMessage('');
        if (mercadoPagoHabilitado) {
            if (token === '') {
                setErrorMessage('Debe ingresar un token de Aplicacion');
                return false;
            }
        }
        return true;
    }


    const onSave = async () => {
        if (!datosValidos()) {
            return;
        }
        setLoading(true);

        try {

            let data = {
                idsucursal: sucursalId,
                idmododecobro: modoDeCobroId,
                habilitarconfiguracion: mercadoPagoHabilitado,
                transferirmonto: transferirMovimientos && mercadoPagoHabilitado,
                idsucursalcajadestino: transferirMovimientos && sucursalCaja ? sucursalCaja : null,
                idusuariocajadestino: transferirMovimientos && usuarioCaja ? usuarioCaja : null,
                metadata: {
                    token: mercadoPagoHabilitado ? token : null,
                    userId: userId,
                },
                id: originalData ? originalData.id : null
            };

            const method = originalData ? updateModoDeCobroSucursalConfiguracion : insertModoDeCobroSucursalConfiguracion;

            method({data}).then(async (result)  => {
                loadDataFromDB(result);

                console.log('insert result',result);
                if(result.habilitarconfiguracion && !result.configuration_checked) {
                    let testResponse = onTest(result.id);
                }else{
                    setLoading(false);
                }
            }).catch(error => {
                setErrorMessage(error?.message ?? error);
                setLoading(false);
            });



        } catch (error) {
            setLoading(false);
            setErrorMessage(error?.message ?? error);
        }
    }
    const onTest = async (configuracionId) => {
        if (!datosValidos()) {
            return;
        }
        setLoading(true);
        setCheckConfigurationErrorMessage('');
        testToken(configuracionId)
            .then((response) => {
                if (response.connection_valid) {
                    setValidMessage('Coneccion valida');
                    setOriginalData(response.configuracion);
                }
            })
            .finally(() => {
                setLoading(false);
            }).catch((error) => {
                setCheckConfigurationErrorMessage(error.message);
        });

    }

    useEffect(() => {
        setValidMessage(false);
    }, [token]);


    const isDirty =
        !(
        parseInt(originalData?.idsucursal) === parseInt(sucursalId) &&
        parseInt(originalData?.idmododecobro) === parseInt(modoDeCobroId) &&
        originalData?.habilitarconfiguracion === mercadoPagoHabilitado &&
        originalData?.transferirmonto === transferirMovimientos &&
        parseInt(originalData?.idsucursalcajadestino ?? 0) === parseInt(sucursalCaja ?? 0) &&
        parseInt(originalData?.idusuariocajadestino ?? 0) === parseInt(usuarioCaja ?? 0) &&
        originalData?.metadata?.token === token &&
        originalData?.metadata?.userId === userId
        )

/*
    console.log('isDirty', isDirty);
    console.log([
    parseInt(originalData?.idsucursal),
    parseInt(originalData?.idmododecobro),
    originalData?.habilitarconfiguracion,
    originalData?.transferirmonto,
    parseInt(originalData?.idsucursalcajadestino ?? 0),
    parseInt(originalData?.idusuariocajadestino ?? 0),
    originalData?.metadata?.token,
        originalData?.metadata?.userId]);
    console.log('isDirty?', isDirty);
    console.log([
    parseInt(sucursalId),
    parseInt(modoDeCobroId),
    mercadoPagoHabilitado,
    transferirMovimientos,
    parseInt(sucursalCaja ?? 0),
    parseInt(usuarioCaja ?? 0),
    token,
    userId]);
*/
    return <div className={''}>
        <ErrorBoundary>
            <Card title={
                <div className={'inline-flex items-center gap-2'}>
                    <CardTitleWithImage image={mercadoPagoLogo} title={'Mercado Pago'}/>
                </div>
            } loading={loading}>
                <p className="mb-4 leading-normal text-sm">Configuracion de mercado pago (solo QR) para la sucursal
                    seleccionada.</p>

                <Checkbox label={'Habilitar Mercado Pago'} value={mercadoPagoHabilitado} className={'ml-2'}
                          onChange={setMercadoPagoHabilitado}/>

                {!mercadoPagoHabilitado && errorMessage && (<LabelError >{errorMessage}</LabelError>)}
                {mercadoPagoHabilitado &&
                    (<div className={'mt-2'}>
                        <SubCard>
                            <H3>Conectividad</H3>
                            <Input type={'text'} label={'App token'} setValue={setToken} value={token}
                                   errorMessage={errorMessage} validMessage={validMessage}/>
                            {/*<Button disabled={loading} onClick={onTest} format={'xs'} className={'mt-1! '}>Test
                                Connection</Button> */}

                            <Input type={'text'} label={'Collector id (user id)'} className={'mt-2'} setValue={setUserId} value={userId}/>

                            <PanelConfiguracionChecked originalData={originalData}
                                                       errorMessage={checkConfigurationErrorMessage}
                                                       checkMercadoPagoQRConfiguracion={onSave}  />
                        </SubCard>
                        <SubCard>
                            <AccionesEspeciales
                                transferirMovimientos={transferirMovimientos}
                                setTransferirMovimientos={setTransferirMovimientos}
                                usuarioCaja={usuarioCaja}
                                setUsuarioCaja={setUsuarioCaja}
                                sucursalCaja={sucursalCaja}
                                setSucursalCaja={setSucursalCaja}
                            />
                        </SubCard>

                    </div>)
                }
                {isDirty && <Button disabled={loading} onClick={onSave} className={'w-20 float-right'}>Guardar</Button>}
            </Card>
        </ErrorBoundary>
    </div>;
}

