<?php

namespace App\DataAccessor;

use App\Models\AgrupacionCaja;
use App\Models\Funcion;
use App\Models\User;
use App\Models\Modulo;
use App\Services\Alertas\Collections\AlertaDetalleCollection;
use App\Services\Alertas\DataAccessors\AlertasDataAccessor;
use App\Services\Alertas\Exceptions\NotImplementedException;
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
                ->where('empresafuncion.activo', 1)
                ->where('perfilfuncion.idperfil', $perfilId)
                ->where('menu', 1)
                ->where('idempresa', $empresaId)
                ->where('idmodulo', $modulo->id)
                ->orderBy('funciones.nombre', 'asc')
                ->get();

            $result = $this->addFuncionesToModule($modulo);
            $modulo->funciones = $modulo->funciones->merge($result);
            //$modulo->funciones = $modulo->funciones->sortBy('nombre');

            if ($modulo->funciones->count() > 0) {
                $menues->push($modulo);
            }
        }

        return $menues;
    }

    /**
     * Retorna todas las agrupaciones de cajas que están activas (activo = 1)
     * y vinculadas al usuario autenticado mediante la tabla agrupacioncajausuarios.
     */
    public function getUserAgrupacionCajas(): Collection
    {
        return DB::table('agrupacioncajas as ac')
            ->select('ac.id', 'ac.descripcion', 'ac.activo', 'ac.importeinicial')
            ->join('agrupacioncajausuarios as acu', 'ac.id', '=', 'acu.idagrupacioncaja')
            ->where('ac.activo', 1)
            ->where('acu.idusuario', $this->user->id)
            ->distinct()
            ->orderBy('ac.descripcion', 'asc')
            ->get();
    }

    private function addFuncionesToModule(Modulo $modulo): Collection
    {
        $result = new Collection();
        if ($modulo->id === 10) //Contabilidad
        {
            //Agregar agrupacion de caja en el menu
            $acajasAgrupadas = $this->getUserAgrupacionCajas()->map(function ($item) use ($modulo) {
                return new Funcion([
                    'id' => 20000 + $item->id,
                    'idmodulo' => $modulo->id,
                    'codigo' => 'agrpscja' . $item->id,
                    'nombre' => $item->descripcion,
                    'pagina' => 'agrpscja' . $item->id,
                    'activa' => true,
                    'observaciones' => 'Agrupacion de caja',
                    'menu' => 1,
                    'neweramenu' => 1
                ]);


            });

            return $acajasAgrupadas;
        }

        return $result;
    }

    public function getAlertas(int $alertaTipoId = null)
    {

        $userId = $this->user->id;

        return app(AlertasDataAccessor::class)->getAlertasSummary($userId, $alertaTipoId);
    }

    /**
     * @throws NotImplementedException
     */
    public function getAlertaDetalles($alertaId): AlertaDetalleCollection
    {
        $userId = $this->user->id;

        $det = app(AlertasDataAccessor::class)
            ->getAlertaDetalles($userId, $alertaId);

        return $det;
    }


}
