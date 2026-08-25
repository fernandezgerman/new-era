import React from 'react';
import {useUsuario} from '@/dataHooks/useUsuarioHooks.jsx';

export const Usuario = ({idusuario, className = ''}) => {
    const {data: usuario, isLoading} = useUsuario({idUsuario: idusuario});

    if (isLoading) {
        return <span className={`italic ${className}`}>Loading</span>;
    }

    if (!usuario) {
        return null;
    }

    const inactivo = usuario.activo != 1;

    return (
        <span className={`${inactivo ? 'text-red-500 line-through ' : ''}${className}`}>
            {usuario.nombre_completo} ({usuario.perfil?.nombre})
        </span>
    );
};
