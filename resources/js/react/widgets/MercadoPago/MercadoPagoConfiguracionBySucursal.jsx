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
        console.log('usr list', usuariosList, usuarioCaja);
        if(usuarioCaja && usuariosList && usuariosList.length > 0 && !usuariosList.reduce((exists, ul) => (usuarioCaja === ul.id || exists), false))
        {
            console.log('remove usr');
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

export const MercadoPagoConfiguracionBySucursal = ({sucursalId, modoDeCobroId}) => {
    const darkMode = useSystemTheme();
    const [mercadoPagoHabilitado, setMercadoPagoHabilitado] = useState(false);
    const [transferirMovimientos, setTransferirMovimientos] = useState(false);
    const [sucursalCaja, setSucursalCaja] = useState(false);
    const [usuarioCaja, setUsuarioCaja] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [validMessage, setValidMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [originalData, setOriginalData] = useState(false);

    const loadDataFromDB =  (entity) => {
        setOriginalData(entity);

        setSucursalCaja(entity.idsucursalcajadestino ?? false);
        setUsuarioCaja(entity.idusuariocajadestino ?? false);
        setMercadoPagoHabilitado(entity.habilitarconfiguracion ?? false);
        setTransferirMovimientos(entity.transferirmonto ?? false);
        setToken(entity.metadata?.token ?? '');
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

    originalData
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
            if(mercadoPagoHabilitado) {
                let testResponse = await testToken(token);
                if (testResponse.connection_valid) {

                }
            }

            let data = {
                idsucursal: sucursalId,
                idmododecobro: modoDeCobroId,
                habilitarconfiguracion: mercadoPagoHabilitado,
                transferirmonto: transferirMovimientos && mercadoPagoHabilitado,
                idsucursalcajadestino: transferirMovimientos && sucursalCaja ? sucursalCaja : null,
                idusuariocajadestino: transferirMovimientos && usuarioCaja ? usuarioCaja : null,
                metadata: {
                    token: mercadoPagoHabilitado ? token : null,
                },
                id: originalData ? originalData.id : null
            };

            const method = originalData ? updateModoDeCobroSucursalConfiguracion : insertModoDeCobroSucursalConfiguracion;

            method({data}).then((result) => {
                loadDataFromDB(result);
            }).finally(() => {
                setLoading(false);
            }).catch(error => {
                setErrorMessage(error?.message ?? error);
            });
        } catch (error) {
            setLoading(false);
            setErrorMessage(error?.message ?? error);
        }
    }
    const onTest = () => {
        if (!datosValidos()) {
            return;
        }
        setLoading(true);

        testToken(token)
            .then((response) => {
                if (response.connection_valid) {
                    setValidMessage('Coneccion valida');
                }
            })
            .finally(() => {
                setLoading(false);
            }).catch((error) => {
                setErrorMessage(error.message);
        });
    }

    useEffect(() => {
        setValidMessage(false);
    }, [token]);

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
                            <Button disabled={loading} onClick={onTest} format={'xs'} className={'mt-1! '}>Test
                                Connection</Button>
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
                <Button disabled={loading} onClick={onSave} className={'w-20 float-right'}>Guardar</Button>
            </Card>
        </ErrorBoundary>
    </div>;
}

