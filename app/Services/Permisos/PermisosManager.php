<?php

namespace App\Services\Permisos;

use App\Models\Funcion;
use App\Models\User;
use App\Services\Permisos\Enums\CodigosPermisos;

class PermisosManager
{
    public static function userCan(CodigosPermisos $permiso, ?User $usuario = null): bool
    {
        $permiso = Funcion::query()
            ->join('perfilfuncion', 'funciones.id', '=', 'perfilfuncion.idfuncion')
            ->where('perfilfuncion.idperfil', ($usuario ?? auth()->user())?->idperfil ?? -1)
            ->where('funciones.activa', 1)
            ->where('funciones.codigo', $permiso->value)
            ->first();

        return !blank($permiso);
    }
}
