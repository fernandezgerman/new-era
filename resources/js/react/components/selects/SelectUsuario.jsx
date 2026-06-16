import React, {useEffect, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Select} from '@/components/Select.jsx';
import uuid from 'react-uuid';
import {useUsuarios} from '@/dataHooks/useUsuarioHooks.jsx';

export const SelectUsuario = ({
    setUsuario,
    usuario,
    errorMessage,
    className,
    label = 'Usuario',
    placeHolder = 'Seleccione un usuario',
    multiple = false,
    disabled = false,
}) => {
    const {data: usuarios, isLoading} = useUsuarios();
    const [usuarioId, setUsuarioId] = useState(
        multiple ? (usuario?.map((u) => parseInt(u.id, 10)) ?? []) : (usuario?.id ?? null),
    );

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (multiple) {
            const selected = usuarios?.filter((u) => usuarioId?.includes(parseInt(u.id, 10))) ?? [];
            setUsuario(selected);
            return;
        }

        setUsuario(
            usuarioId !== null
                ? usuarios?.reduce(
                    (acum, user) => parseInt(user.id, 10) === parseInt(usuarioId, 10) ? user : acum,
                    null,
                )
                : null,
        );
    }, [usuarioId, isLoading, multiple, setUsuario, usuarios]);

    return (
        <ErrorBoundary>
            <Select
                options={
                    usuarios?.map((u) => ({
                        key: uuid(),
                        value: u.id,
                        label: `${u.nombre ?? ''} ${u.apellido ?? ''}`.trim(),
                    })) ?? []
                }
                value={usuarioId}
                className={(className ?? '') + ' mt-4'}
                setValue={(val) => {
                    if (multiple) {
                        setUsuarioId(val.map((v) => parseInt(v, 10)));
                    } else {
                        setUsuarioId(val != null ? parseInt(val, 10) : null);
                    }
                }}
                placeholder={placeHolder}
                label={label}
                errorMessage={errorMessage}
                multiple={multiple}
                allowRemove={multiple}
                disabled={disabled}
                isLoading={isLoading}
                searchResultLimit={-1}
            />
        </ErrorBoundary>
    );
};
