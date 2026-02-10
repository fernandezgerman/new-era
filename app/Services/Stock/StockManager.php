<?php

namespace App\Services\Stock;

use App\Models\Articulo;
use App\Models\Existencia;
use App\Models\Sucursal;
use Herrera\Annotations\Exception\InvalidXmlException;

class StockManager
{
    public function setStock(Articulo $articulo, Sucursal $sucursal, float $nuevaCantidad): Existencia
    {
        $existencia = Existencia::query()
            ->where('idarticulo', $articulo->id)
            ->where('idsucursal', $sucursal->id)
            ->first();

        if(blank($existencia)){
            $existencia = new Existencia();
            $existencia->idarticulo = $articulo->id;
            $existencia->idsucursal = $sucursal->id;
        }

        $existencia->cantidad = $nuevaCantidad;
        $existencia->save();

        return $existencia;
    }
}
