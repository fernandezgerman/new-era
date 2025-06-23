<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

class AuthHelper
{
    /**
     * Get the authenticated user's data based on the session key.
     *
     * @param string $key The session key to get the data for
     * @return mixed The user data
     */
    public static function getUserData($key)
    {
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        switch ($key) {
            case 'usuarioId':
                return $user->id;
            case 'usuarioNombre':
                return $user->nombre;
            case 'usuarioApellido':
                return $user->apellido;
            case 'usuarioIdEmpresa':
                return $user->empresa ? $user->empresa->id : null;
            case 'usuarioEmpresaNombre':
                return $user->empresa ? $user->empresa->nombreComercial : null;
            case 'usuarioPerfilId':
                return $user->perfil ? $user->perfil->id : null;
            case 'usuarioLogin':
                return $user->usuario;
            case 'usuarioActivo':
                return $user->activo;
            case 'intentosLogin':
                return $user->intentosLogin;
            default:
                return session($key);
        }
    }
}
