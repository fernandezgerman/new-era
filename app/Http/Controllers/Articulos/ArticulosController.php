<?php

namespace App\Http\Controllers\Articulos;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Articulos\GetArticulosHistoricoDeCostosRequest;
use App\Http\Requests\Caja\GetUltimaCajaRequest;
use App\Models\Articulo;
use App\Services\Articulos\ArticulosManager;
use App\Services\Cajas\CajaManager;

class ArticulosController extends BaseController
{
    public function articulosHistoricoDeCostos(GetArticulosHistoricoDeCostosRequest $getArticulosHistoricoDeCostosRequest)
    {
        // For now, just echo back the validated payload as JSON
        $getArticulosHistoricoDeCostosRequest->validated();

        return app(ArticulosManager::class)->getArticuloHistoricoCostos(
            /** @var Articulo $articulo */
            get_entity_or_fail('Articulo', $getArticulosHistoricoDeCostosRequest->idarticulo)
        );

    }

}
