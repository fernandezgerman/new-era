<?php

namespace App\DataAccessor;

use App\Models\Funcion;
use App\Models\User;
use App\Models\Modulo;
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

    public function getMenu(): Collection
    {
        $empresaId = $this->user->idempresa ?? null;
        $perfilId = $this->user->idperfil ?? null;

        $menues = collect([]);

        $modulos = Modulo::query()->orderBy('descripcion', 'asc')->get();

        foreach ($modulos as $modulo) {
            $modulo->funciones = Funcion::query()
                ->join('perfilfuncion', 'funciones.id', '=', 'perfilfuncion.idfuncion')
                ->join('empresafuncion', 'funciones.id', '=', 'empresafuncion.idfuncion')
                ->where('empresafuncion.activo',1)
                ->where('perfilfuncion.idperfil', $perfilId)
                ->where('menu',1)
                ->where('idempresa',$empresaId)
                ->where('idmodulo',$modulo->id)
                ->orderBy('funciones.nombre', 'asc')
                ->get();

            if ($modulo->funciones->count() > 0) {
                $menues->push($modulo);
            }
        }

        return $menues;
    }

}
