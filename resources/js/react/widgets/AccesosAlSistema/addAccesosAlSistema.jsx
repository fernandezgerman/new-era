import React, {useEffect, useState} from 'react';
import {CustomModal} from "@/components/Modal.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import uuid from "react-uuid";
import {Select} from "@/components/Select.jsx";
import {SelectUsuario} from "@/components/selects/SelectUsuario.jsx";
import {SelectPerfil} from "@/components/selects/SelectPerfil.jsx";
import {DayOfWeek} from "@/components/DayOfWeek.jsx";
import {DatePicker} from "@/components/DatePicker.jsx";
import {TimePickerFromTo} from "@/components/TimePickerFromTo.jsx";
import {Label, LabelError} from "@/components/Label.jsx";
import {useUsuarios} from "@/dataHooks/useUsuarioHooks.jsx";
import {useInsertAccesoPorHora, useUpdateAccesoPorHora} from "@/dataHooks/useAccesosPorHora.jsx";

const TipoDeTarget = [
    'Todos',
    'Usuario',
    'Perfil',
];

const TipoDeAccion = [
    'Restringir',
    'Permitir'
];

const TipoDeMomento = [
    'Todos',
    'Dia de la semana',
    'Fecha puntual'
];
export const AddAccesosAlSistema = ({isOpen, setIsOpen, accesoSeleccionado}) => {
    const { mutate: insertAcceso, isPending: insertPending } = useInsertAccesoPorHora();
    const { mutate: updateAcceso, isPending: updatePending } = useUpdateAccesoPorHora();
    const saving = insertPending || updatePending;

    const [errorGeneral, setErrorGeneral] = useState(null);
    const [data, setData] = useState(accesoSeleccionado ?? {})

    const formatHour  =  (hour) => hour ? ((hour < 10 ? ('0' + hour) : hour)) + ':00' : 'Todos' ;

    useEffect(() => {
        if (accesoSeleccionado) {
            let tipodemomento = 'Todos';
            if (accesoSeleccionado.diadelasemana) tipodemomento = 'Dia de la semana';
            else if (accesoSeleccionado.fecha) tipodemomento = 'Fecha puntual';

            let targettype = 'Todos';
            if (accesoSeleccionado.targettype === 'Usuario' || accesoSeleccionado.targettype === 'App\\Models\\User') targettype = 'Usuario';
            else if (accesoSeleccionado.targettype === 'Perfil' || accesoSeleccionado.targettype === 'App\\Models\\Perfil') targettype = 'Perfil';


            console.log('accesoSeleccionado', accesoSeleccionado);
            setData({
                accion: accesoSeleccionado.accion,
                targettype: targettype,
                target: accesoSeleccionado.target,
                tipodemomento: tipodemomento,
                diadelasemana: accesoSeleccionado.diadelasemana,
                fecha: accesoSeleccionado.fecha ? new Date(accesoSeleccionado.fecha  + ' 14:00:00') : null,
                horadesde: formatHour(accesoSeleccionado.horadesde ),
                horahasta: formatHour(accesoSeleccionado.horahasta),
            });

        } else {
            setData({
                accion: 'Restringir',
                targettype: null,
                target: null,
                tipodemomento: null,
                diadelasemana: null,
                fecha: null,
                horadesde: 'Todos',
                horahasta: 'Todos',
            });
        }
    }, [accesoSeleccionado, isOpen]);

    const {data: usuariosAfectados} = useUsuarios([], [],
        {activo: true, idperfil: (data.targettype=== 'Perfil' ? data.target?.id : null)}, (data.targettype=== 'Perfil' && data.target?.id > 0) );

    const [errores, setErrores] = useState({
        accion: null,
        targettype: null,
        target: null,
        tipodemomento: null,
        diadelasemana: null,
        fecha: null,
        horadesde: null,
        horahasta: null,
    })

    useEffect(() => {
        console.log('data from add', data);
    }, [data]);
    const validData = () => {
        let valid = true;
        const errors = {};
        if (!data.accion) {
            errors.accion = 'Seleccione una accion';
            valid = false;
        }
        if (!data.targettype) {
            errors.targettype = 'Seleccione un target';
            valid = false;
        }

        if (data.targettype === 'Usuario' && !data.target) {
            errors.target = 'Seleccione un usuario';
            valid = false;
        }

        if (data.targettype === 'Perfil' && !data.target) {
            errors.target = 'Seleccione un perfil';
            valid = false;
        }

        if (!data.tipodemomento) {
            errors.tipodemomento = 'Seleccione un tipo de momento';
            valid = false;
        }

        if (data.tipodemomento === 'Dia de la semana' && !data.diadelasemana) {
            errors.diadelasemana = 'Seleccione un dia de la semana';
            valid = false;
        }

        if (data.tipodemomento === 'Fecha puntual' && !data.fecha) {
            errors.fecha = 'Seleccione una fecha';
        }

        if (!data.horadesde) {
            errors.horadesde = 'Seleccione una hora desde';
            valid = false;
        }

        if (!data.horahasta) {
            errors.horahasta = 'Seleccione una hora hasta';
            valid = false;
        }

        setErrores(errors);

        return valid;
    }

    const checkTodos = (value) => (value === 'Todos' ? null : value);

    const onSave = () => {
        setErrorGeneral(null);
        if(validData()){
            const payload = {
                accion: data.accion,
                targettype: checkTodos(data.targettype),
                targetid: data.target?.id ?? null,
                tipodemomento: checkTodos(data.tipodemomento),
                diadelasemana: data.tipodemomento !== 'Dia de la semana' ? null : checkTodos(data.diadelasemana),
                fecha: data.tipodemomento !== 'Fecha puntual' ? null : (data.fecha ? (data.fecha instanceof Date ? data.fecha.toISOString().split('T')[0] : data.fecha) : null),
                horadesde: checkTodos(data.horadesde),
                horahasta: checkTodos(data.horahasta)  ,
            };

            if (accesoSeleccionado?.id) {
                updateAcceso({ id: accesoSeleccionado.id, data: payload }, {
                    onSuccess: () => {
                        setIsOpen(false);
                    },
                    onError: (error) => {
                        setErrorGeneral(error);
                    },
                });
            } else {
                insertAcceso(payload, {
                    onSuccess: () => {
                        setIsOpen(false);
                    },
                    onError: (error) => {
                        setErrorGeneral(error);
                    },
                });
            }
        }
    }

    return (
        <ErrorBoundary>
            <CustomModal
                onAceptar={onSave}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                copete={<>
                    <p><b>Desde aca se puede restringir o habilitar usuarios a ingresar al sistema web por horario.</b>
                    </p>
                    <div>
                        Tenga en cuenta que:
                        <div> - Cualquier accion de "Permitir" tiene prioridad por sobre una accion de
                            "Restringir"</div>
                        <div> - Tanto "Restringir" como "Permitir" tienen prioridad por sobre una accion de "Todos"
                        </div>
                    </div>
                </>}
                titulo={accesoSeleccionado?.id ? 'Editar acceso al sistema' : 'Agregar acceso al sistema'}
                loading={saving}
            >
                <div className={'space-y-4'}>
                    {errorGeneral && <LabelError>{errorGeneral.message}</LabelError>}
                    <Select
                        options={TipoDeAccion?.map((target) => ({key: uuid(), value: target, label: target})) ?? []}
                        value={data.accion}
                        className={'mt-4 mb-3'}
                        setValue={(selectedTarget) => setData({...data, accion: selectedTarget})}
                        placeholder="Seleccione el tipo de accion"
                        label={'Accion'}
                        errorMessage={errores.accion}
                    />

                    <TimePickerFromTo dateFrom={data.horadesde} dateTo={data.horahasta}
                                      setDateFrom={(horadesde) => setData({...data, horadesde})}
                                      setDateTo={(horahasta) => setData({...data, horahasta})}
                                      errorMessageTo={errores.horahasta}
                                      errorMessageFrom={errores.horadesde}
                    />

                    <div className={'grid grid-cols-2'}>
                        <div className={'pr-2'}>
                            <Select
                                options={TipoDeMomento?.map((target) => ({
                                    key: uuid(),
                                    value: target,
                                    label: target
                                })) ?? []}
                                value={data.tipodemomento}
                                className={'mt-4'}
                                setValue={(selectedTarget) => setData({...data, tipodemomento: selectedTarget})}
                                placeholder="Seleccione el tipo de momento"
                                label={'Tipo de momento'}
                                errorMessage={errores.tipodemomento}
                            />
                        </div>
                        <div className={'pl-2'}>
                            {data.tipodemomento === 'Dia de la semana' && (
                                <DayOfWeek value={data.diadelasemana}
                                           setValue={(diadelasemana) => setData({...data, diadelasemana})}
                                           errorMessage={errores.diadelasemana}/>

                            )}

                            {data.tipodemomento === 'Fecha puntual' && (
                                <DatePicker value={data.fecha} setValue={(fecha) => setData({...data, fecha})}
                                            errorMessage={errores.fecha}/>)}
                        </div>
                    </div>


                    <div className={'grid grid-cols-2 '}>
                        <div className={'pr-2'}>
                            <Select
                                options={TipoDeTarget?.map((target) => ({
                                    key: uuid(),
                                    value: target,
                                    label: target
                                })) ?? []}
                                value={data.targettype}
                                className={'mt-4'}
                                setValue={(selectedTarget) => setData({
                                    ...data,
                                    target: null,
                                    targettype: selectedTarget
                                })}
                                placeholder="Seleccione un target a restringir / habilitar"
                                label={'Tipo'}
                                errorMessage={errores.targettype}
                            />
                        </div>
                        <div className={'pl-2'}>
                            {data.targettype === 'Usuario' && (
                                <SelectUsuario usuario={data.target}
                                               setUsuario={(usuario) => setData({...data, target: usuario})}
                                               errorMessage={errores.target}/>
                            )}

                            {data.targettype === 'Perfil' && (
                                <SelectPerfil perfil={data.target}
                                              setPerfil={(perfil) => setData({...data, target: perfil})}
                                              errorMessage={errores.target}/>
                            )}
                        </div>
                    </div>
                    {

                        (data.targettype === 'Perfil' && data.target) && (
                            <div className={'colspan-2'}>
                                <Label>Usuarios Alcanzados</Label>
                                <div className={'max-h-50  overflow-y-scroll text-sm italic text-gray-500'}>
                                    {usuariosAfectados && usuariosAfectados.map( (user, index) => ((index > 0 ? ', ' : '') + user.nombre + ' ' + user.apellido) ) }

                                </div>
                            </div>
                        )
                    }
                </div>
            </CustomModal>
        </ErrorBoundary>
    );
}

