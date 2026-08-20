<?php

namespace App\Services\Stock;

use App\Models\Articulo;
use App\Models\ArticuloCompuesto;
use App\Models\ArticuloStockVisible;
use App\Models\Existencia;
use App\Models\Sucursal;
use App\Models\VentaArticuloCompuesto;
use App\Services\Actualizaciones\ActualizacionesManager;
use Herrera\Annotations\Exception\InvalidXmlException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class StockManager
{
    public function setStock(Articulo $articulo, Sucursal $sucursal, float $nuevaCantidad): Existencia
    {
        $existencia = Existencia::query()
            ->where('idarticulo', $articulo->id)
            ->where('idsucursal', $sucursal->id)
            ->first();

        if (blank($existencia)) {
            $existencia = new Existencia();
            $existencia->idarticulo = $articulo->id;
            $existencia->idsucursal = $sucursal->id;
        }

        $existencia->cantidad = $nuevaCantidad;
        $existencia->save();

        return $existencia;
    }

    /**
     * Afecta el stock en la cantidad pasada como parametro
     */
    public function affectStock(Articulo $articulo, Sucursal $sucursal, float $cantidad): void
    {
        if ($articulo->rubro->esrubrogastos) return;

        if (!$articulo->escompuesto) {
            DB::unprepared("
                insert into existencias(idsucursal, idarticulo, cantidad)
                    values ( {$sucursal->id},{$articulo->id},{$cantidad})
                             ON DUPLICATE KEY UPDATE
                               cantidad = cantidad + {$cantidad} ");
        } else {
            /** Afecta los articulos compuestos */
            $compuestos = ArticuloCompuesto::where('idcompuesto', $articulo->id)->get();
            foreach ($compuestos as $compuesto) {
                $this->affectStock($compuesto->articulo, $sucursal, $cantidad * $compuesto->cantidad);
            }
        };

        $articuloStockVisible = ArticuloStockVisible::where('id', $articulo->id)->first();

        if(!blank($articuloStockVisible)) {
            app(ActualizacionesManager::class)->ActualizarArticuloConStockVisible($articulo, $sucursal);
        }

    }
}
