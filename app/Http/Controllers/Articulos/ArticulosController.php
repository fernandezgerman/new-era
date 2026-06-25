<?php

namespace App\Http\Controllers\Articulos;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Articulos\GetArticulosHistoricoDeCostosRequest;
use App\Http\Requests\Articulos\GetArticulosHistoricoDePreciosRequest;
use App\Http\Requests\Articulos\GetArticulosNoCompradosRequest;
use App\Http\Requests\Caja\GetUltimaCajaRequest;
use App\Models\Articulo;
use App\Models\Rubro;
use App\Models\Sucursal;
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

    public function articulosHistoricoDePrecios(GetArticulosHistoricoDePreciosRequest $getArticulosHistoricoDePreciosRequest)
    {
        // For now, just echo back the validated payload as JSON
        $getArticulosHistoricoDePreciosRequest->validated();

        return app(ArticulosManager::class)->getArticuloHistoricoPrecios(
        /** @var Articulo $articulo */
            get_entity_or_fail('Articulo', $getArticulosHistoricoDePreciosRequest->idarticulo)
        );
    }

    /**
     * Artículos con existencias no comprados hace X días.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: GET /api/articulos/no-comprados
     *
     * Request Payload (Query Parameters):
     * - diasUltimaCompra: int (Mandatorio, cantidad de días desde la última compra)
     * - idarticulo: int (Opcional, ID de un artículo específico)
     * - idsucursal: int (Opcional, ID de una sucursal)
     * - idrubro: int (Opcional, ID de un rubro)
     *
     * Ejemplo: /api/articulos/no-comprados?diasUltimaCompra=30&idrubro=5
     *
     * Json Response:
     * {
     *   "current_page": 1,
     *   "data": [
     *     {
     *       "codigo": "ART001",
     *       "nombre": "Nombre del Articulo",
     *       "id": 123,
     *       "compraId": 456,
     *       "fechahora": "2023-01-01 10:00:00",
     *       "ult_compra": 30,
     *       "rubroNombre": "Nombre del Rubro",
     *       "sucursalId": 1,
     *       "sucursalNombre": "Nombre de la Sucursal",
     *       "cantidad": 10.5,
     *       "ultima_venta": 30
     *     }
     *   ],
     *   "first_page_url": "...",
     *   "from": 1,
     *   "last_page": 1,
     *   "last_page_url": "...",
     *   "links": [...],
     *   "next_page_url": null,
     *   "path": "...",
     *   "per_page": 15,
     *   "prev_page_url": null,
     *   "to": 1,
     *   "total": 1
     * }
     *
     * @param GetArticulosNoCompradosRequest $request
     * @return mixed
     */
    public function articulosNoComprados(GetArticulosNoCompradosRequest $request): mixed
    {
        $request->validated();

        /** @var ArticulosManager $articulosManager */
        $articulosManager = app(ArticulosManager::class);

        return $articulosManager->getExistenciasNoCompradasPor(
            diasUltimaCompra: (int)$request->input('diasUltimaCompra'),
            sucursal: get_entity_or_fail('Sucursal', $request->input('idsucursal'), true),
            articulo: get_entity_or_fail('Articulo', $request->input('idarticulo'), true),
            rubro: get_entity_or_fail('Rubro', $request->input('idrubro'), true)
        );
    }


}
