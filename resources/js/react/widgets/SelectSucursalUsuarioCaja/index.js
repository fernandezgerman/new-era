import React, {useEffect, useState} from 'react';
import {useSucursales} from "@/dataHooks/useSucursales.jsx";
import uuid from "react-uuid";
import {Select} from "@/components/Select.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";

export const SelectSucursalUsuarioCaja = ({setUsuario, setSucursal, usuario, sucursal}) => {
    const [usuariosList, setUsuariosList] = useState([]);
    const {data: sucursales, refetch, isLoading, isRefetching} = useSucursales();
    const [sucursalId, setSucursalId] = useState(sucursal?.id);
    const [usuarioId, setUsuarioId] = useState(usuario?.id);


    const selectUsuariosList = usuariosList.map((usuario) => ({
        key: uuid(),
        value: usuario.id,
        label: usuario.nombre + ' ' + usuario.apellido
    }));

    useEffect(() => {
        if (sucursalId) {

            const sucursalSeleccionada = sucursales.reduce((acum, suc) => parseInt(suc.id) === parseInt(sucursalId) ? suc : acum, null)
            console.log(sucursalSeleccionada, sucursalId);
            setUsuarioId(null)
            setUsuariosList(sucursalSeleccionada ? (sucursalSeleccionada.usuarios_cajas ?? []) : []);
        } else {
            setUsuariosList([]);
        }
    }, [sucursalId]);

    useEffect(() => {
        setSucursalId(null);
        setUsuarioId(null);
    }, [sucursales]);

    useEffect(() => {
        setSucursal(
            sucursalId !== null ? sucursales?.reduce(
                (acum, suc) => parseInt(suc.id) === parseInt(sucursalId) ? suc : acum, null)

            :null);
    }, [sucursalId]);

    useEffect(() => {

        setUsuario(
            usuarioId !== null ? usuariosList?.reduce(
                (acum, user) => parseInt(user.id) === parseInt(usuarioId) ? user : acum, null)
            :null);
    }, [usuarioId]);

    return <ErrorBoundary>
        {!(isLoading) && <Select
            options={sucursales?.map((sucursalId) => ({key: uuid(), value: sucursalId.id, label: sucursalId.nombre}))}
            value={sucursalId}
            className={'mt-4'}
            setValue={(sucursalId) => setSucursalId(sucursalId)}
            placeholder="Seleccione una sucursal"
            label={'Sucursal'}
        />}
        {sucursalId && (
            <>
                <Select
                    options={selectUsuariosList}
                    className={'mt-4'}
                    value={usuarioId}
                    setValue={setUsuarioId}
                    placeholder="Seleccione un usuario"
                    label={'Usuario'}
                />
            </>
        )}

        {!sucursalId && (
            <div className={'mt-4'}> Seleccione una sucursalId para ver los usuarios</div>
        )}
    </ErrorBoundary>
}
