<?php

namespace App\DataAccessor;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
class UsuarioDataAccessor extends DataAccessorBase
{
    public function __construct(private User $user)
    {

    }

    public function getAllowedSucursales(): Collection
    {
        return DB::table('sucursales')
            ->select('sucursales.id', 'sucursales.nombre')
            ->join('usuariossucursales', 'sucursales.id', '=', 'usuariossucursales.idsucursal')
            ->where('sucursales.activo', 1)
            ->where('usuariossucursales.idusuario', $this->user->id)
            ->get();
    }
}
