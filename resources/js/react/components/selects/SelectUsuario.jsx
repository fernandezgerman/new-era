import React, {useEffect, useState} from 'react';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {Select} from "@/components/Select.jsx";
import uuid from "react-uuid";
import {useUsuarios} from "@/dataHooks/useUsuarioHooks.jsx";
export const SelectUsuario = ({setUsuario, usuario, errorMessage}) => {
    const {data: usuarios} = useUsuarios();
    const [usuarioId, setUsuarioId] = useState(usuario?.id ?? null);

    useEffect(() => {
        setUsuario(
            usuarioId !== null ? usuarios?.reduce(
                    (acum, user) => parseInt(user.id) === parseInt(usuarioId) ? user : acum, null)
                :null);
    }, [usuarioId]);


    console.log('errorMessage user', errorMessage );
    return <ErrorBoundary>
        <Select
            options={usuarios?.map((usuario) => ({key: uuid(), value: usuario.id, label: usuario.nombre + ' ' + usuario.apellido})) ?? []}
            value={usuarioId}
            className={'mt-4'}
            setValue={(usuarioId) => setUsuarioId(parseInt(usuarioId))}
            placeholder="Seleccione un usuario"
            label={'Usuario'}
            errorMessage={errorMessage}
        />
    </ErrorBoundary>

}
