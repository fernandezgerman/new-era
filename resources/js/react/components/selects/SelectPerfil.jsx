import React, {useEffect, useState} from 'react';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {Select} from "@/components/Select.jsx";
import uuid from "react-uuid";
import {usePerfiles} from "@/dataHooks/usePerfiles.jsx";

export const SelectPerfil = ({setPerfil, perfil, errorMessage}) => {
    const {data: perfiles, isLoading} = usePerfiles();
    const [perfilId, setPerfilId] = useState(perfil?.id ?? null);

    useEffect(() => {

        if(isLoading) return;

        const perfil = perfilId !== null ? perfiles?.reduce(
                (acum, perfil) => parseInt(perfil.id) === parseInt(perfilId) ? perfil : acum, null)
            : null

        setPerfil(perfil);
    }, [perfilId, perfiles]);

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
