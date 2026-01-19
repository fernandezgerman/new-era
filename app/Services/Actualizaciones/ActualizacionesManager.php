<?php

namespace App\Services\Actualizaciones;

use App\Models\Articulo;
use App\Models\Sucursal;
use App\Services\Actualizaciones\Contracts\ActualizableItem;
use App\Services\Actualizaciones\Contracts\ActualizacionesDriverInterface;
use App\Services\Actualizaciones\DTO\OrdenDeActualizacionDTO;
use Illuminate\Support\Facades\DB;

class ActualizacionesManager
{
    public function __construct(private ActualizacionesDriverInterface $actualizacionesDriverInterface)
    {

    }

    public function insertarActualizacion(ActualizableItem $actualizableItem, ?Sucursal $sucursal = null): void
    {
        $this->actualizacionesDriverInterface->insActualizacion(
            new OrdenDeActualizacionDTO(
                $actualizableItem->getIdentificadoresActualizacion(),
                $sucursal === null ? null : [$sucursal->id]
            )
        );
    }
    public function ActualizarArticuloConStockVisible(Articulo $articulo, Sucursal $sucursal): void
    {
        // Translate stored procedure logic from insActStockVisible
        // Determine if there's a modification entry newer than the last updated one
        $apFecha = DB::table('act_articulosstockvisiblemodificacion')
            ->where('idarticulo', $articulo->id)
            ->where('idsucursal', $sucursal->id)
            ->max('fechahora');

        $amFecha = DB::table('act_articulosstockvisibleactualizados')
            ->where('idarticulo', $articulo->id)
            ->where('idsucursal', $sucursal->id)
            ->max('fechahora');

        $vEsta = null;
        if ($apFecha !== null) {
            if ($amFecha === null || $amFecha < $apFecha) {
                $vEsta = 1; // condition satisfied as in SP SELECT
            }
        }

        // If condition is not satisfied (v_esta is NULL), insert a closed modification row
        if ($vEsta === null) {
            DB::table('act_articulosstockvisiblemodificacion')->insert([
                'idsucursal' => $sucursal->id,
                'idarticulo' => $articulo->id,
                'fechahora' => DB::raw('NOW()'),
                'cerrada' => 1,
                'fechahoracierre' => DB::raw('NOW()'),
            ]);
        }
    }
}
