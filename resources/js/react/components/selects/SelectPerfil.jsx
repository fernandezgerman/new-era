import React, {useEffect, useState} from 'react';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {Select} from "@/components/Select.jsx";
import uuid from "react-uuid";
import {usePerfiles} from "@/dataHooks/usePerfiles.jsx";

export const SelectPerfil = ({setPerfil, perfil, errorMessage}) => {
    const {data: perfiles} = usePerfiles();
    const [perfilId, setPerfilId] = useState(perfil?.id ?? null);

    useEffect(() => {
        setPerfil(
            perfilId !== null ? perfiles?.reduce(
                    (acum, perfil) => parseInt(perfil.id) === parseInt(perfilId) ? perfil : acum, null)
                :null);
    }, [perfilId]);

    return <ErrorBoundary>
        <Select
            options={perfiles?.map((perfil) => ({key: uuid(), value: perfil.id, label: perfil.nombre})) ?? []}
            value={perfilId}
            className={'mt-4'}
            setValue={(perfilId) => setPerfilId(parseInt(perfilId))}
            placeholder="Seleccione una perfil"
            label={'Perfil'}
            errorMessage={errorMessage}
        />
    </ErrorBoundary>

}
