<?php

namespace App\Http\Controllers\Promociones;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Promociones\SetPromocionArticulosRequest;
use App\Promociones\DTOs\ArticuloPromocionDTO;
use App\Promociones\PromocionesManager;
use Illuminate\Http\JsonResponse;

class PromocionesController extends BaseController
{
    public function __construct(private PromocionesManager $promocionesManager)
    {
    }

    /**
     * Save a collection of promotion articles.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: POST /api/promociones/articulos
     *
     * Request Payload (Query Parameters / Body):
     * - articulos: array (Required, List of promotion articles)
     *   - id: integer (Optional, The ID of the promotion article to update)
     *   - promocion_id: integer (Required, The ID of the promotion)
     *   - articulo_id: integer (Required, The ID of the article)
     *   - porcentaje: numeric (Required, The percentage discount)
     *   - cantidad: numeric (Required, The quantity)
     *   - precio: numeric (Required, The price)
     *   - activo: integer (Required, 1 for active, 0 for inactive)
     *
     * Example Body:
     * {
     *   "articulos": [
     *     {
     *       "promocion_id": 1,
     *       "articulo_id": 101,
     *       "porcentaje": 10.0,
     *       "cantidad": 1.0,
     *       "precio": 90.0,
     *       "activo": 1
     *     }
     *   ]
     * }
     *
     * Json Response:
     * {
     *   "success": true
     * }
     *
     * Reglas:
     * - If id is null, it inserts a new record.
     * - If id is provided, it updates the existing record.
     *
     * @param SetPromocionArticulosRequest $request
     * @return JsonResponse
     */
    public function setPromocionArticulos(SetPromocionArticulosRequest $request): JsonResponse
    {
        $articulosDTO = collect($request->validated()['articulos'])->map(function ($articulo) {
            return new ArticuloPromocionDTO(
                id: $articulo['id'] ?? null,
                promocion_id: $articulo['promocion_id'],
                articulo_id: $articulo['articulo_id'],
                porcentaje: (float) $articulo['porcentaje'],
                cantidad: (float) $articulo['cantidad'],
                precio: (float) $articulo['precio'],
                activo: (int) $articulo['activo']
            );
        });

        $this->promocionesManager->AddArticulosToPromociones($articulosDTO);

        return response()->json(['success' => true]);
    }
}
