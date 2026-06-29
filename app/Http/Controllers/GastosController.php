<?php

namespace App\Http\Controllers;

use App\DTOs\EditarGastoDTO;
use App\Http\Requests\GastoDetalleRequest;
use App\Http\Requests\ReporteGastosRequest;
use App\Http\Requests\UpdateGastoRequest;
use App\Models\LiquidacionPeriodo;
use App\Models\Sucursal;
use App\Services\Gastos\GastosManager;
use Illuminate\Http\JsonResponse;

class GastosController extends Controller
{
    public function __construct(
        protected GastosManager $gastosManager
    ) {}

    /**
     * Reporte de gastos por rubro y periodo.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: GET /api/gastos/reporte
     *
     * Request Payload (Query Parameters):
     * - periodos: int[] (Opcional, IDs de liquidacionesperiodo. Al menos este o fechas deben estar presentes)
     * - fecha_desde: string (Opcional, Formato YYYY-MM-DD. Al menos este o periodos deben estar presentes)
     * - fecha_hasta: string (Opcional, Formato YYYY-MM-DD. Al menos este o periodos deben estar presentes)
     * - sucursales: int[] (Opcional, IDs de sucursales para filtrar los gastos)
     *
     * Ejemplo: /api/gastos/reporte?periodos[]=1&periodos[]=2&sucursales[]=5
     *
     * Json Response:
     * [
     *   {
     *     "id": 123,
     *     "descripcion": "Nombre del Periodo",
     *     "nombre": "Nombre del Rubro",
     *     "importe": 1250.50,
     *     "periodoId": 1,
     *     "sucursales_per_periodo": 5,
     *     "total": null
     *   },
     *   ...
     * ]
     *
     * Reglas:
     * - Se agrupa por rubro y periodo.
     * - Solo incluye rubros marcados como esrubrogastos = 1.
     * - Ordenado por nombre de rubro ASC e ID de periodo DESC.
     *
     * @param ReporteGastosRequest $request
     * @return JsonResponse
     */
    public function reporte(ReporteGastosRequest $request): JsonResponse
    {
        $periodos = null;
        if ($request->filled('periodos')) {
            $periodos = LiquidacionPeriodo::whereIn('id', $request->input('periodos'))->get();
        }

        $sucursales = null;
        if ($request->filled('sucursales')) {
            $sucursales = Sucursal::whereIn('id', $request->input('sucursales'))->get();
        }

        $reporte = $this->gastosManager->reporteDeGastos(
            periodos: $periodos,
            fechaDesde: $request->input('fecha_desde'),
            fechaHasta: $request->input('fecha_hasta'),
            sucursales: $sucursales
        );

        return response()->json($reporte->toArray());
    }

    /**
     * Reporte de gastos para artículos de un rubro específico, agrupado por periodo.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: GET /api/gastos/reporte/articulo/{idrubro}/agrupado
     *
     * Request Payload (Query Parameters): Same as /api/gastos/reporte
     * - periodos: int[] (Opcional)
     * - fecha_desde: string (Opcional)
     * - fecha_hasta: string (Opcional)
     * - sucursales: int[] (Opcional)
     *
     * Path Parameters:
     * - idrubro: int (ID del rubro)
     *
     * Json Response:
     * [
     *   {
     *     "id": 456,
     *     "descripcion": "Nombre del Periodo",
     *     "nombre": "Nombre del Articulo",
     *     "importe": 1250.50,
     *     "periodoId": 1,
     *     "sucursales_per_periodo": 5,
     *     "total": null
     *   },
     *   ...
     * ]
     *
     * @param int $idrubro
     * @param ReporteGastosRequest $request
     * @return JsonResponse
     */
    public function reporteArticulosPorRubroAgrupado(int $idrubro, ReporteGastosRequest $request): JsonResponse
    {
        $periodos = null;
        if ($request->filled('periodos')) {
            $periodos = LiquidacionPeriodo::whereIn('id', $request->input('periodos'))->get();
        }

        $sucursales = null;
        if ($request->filled('sucursales')) {
            $sucursales = Sucursal::whereIn('id', $request->input('sucursales'))->get();
        }

        $reporte = $this->gastosManager->reporteDeGastosArticulosPorRubro(
            idrubro: $idrubro,
            periodos: $periodos,
            fechaDesde: $request->input('fecha_desde'),
            fechaHasta: $request->input('fecha_hasta'),
            sucursales: $sucursales
        );

        return response()->json($reporte->toArray());
    }

    /**
     * Reporte de gastos para un artículo específico, agrupado por articulo.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: GET /api/gastos/articulo/{idarticulo}/reporte
     *
     * Path Parameters:
     * - idarticulo: int (ID del artículo)
     *
     * Request Payload (Query Parameters): Same as /api/gastos/reporte
     * - periodos: int[] (Opcional)
     * - fecha_desde: string (Opcional)
     * - fecha_hasta: string (Opcional)
     * - sucursales: int[] (Opcional)
     *
     * Json Response:
     * [
     *   {
     *     "id": 456,
     *     "descripcion": "Nombre del Periodo",
     *     "nombre": "Nombre del Articulo",
     *     "importe": 1250.50,
     *     "sucursal": "Nombre de la Sucursal",
     *     "periodoId": 1,
     *     "total": 2
     *   },
     *   ...
     * ]
     *
     * Reglas:
     * - No incluye sucursales_per_periodo ya que es un reporte no agrupado por periodo (se muestra cada gasto individual con su sucursal).
     *
     * @param int $idarticulo
     * @param ReporteGastosRequest $request
     * @return JsonResponse
     */
    public function reporteArticulo(int $idarticulo, ReporteGastosRequest $request): JsonResponse
    {
        $periodos = null;
        if ($request->filled('periodos')) {
            $periodos = LiquidacionPeriodo::whereIn('id', $request->input('periodos'))->get();
        }

        $sucursales = null;
        if ($request->filled('sucursales')) {
            $sucursales = Sucursal::whereIn('id', $request->input('sucursales'))->get();
        }

        $reporte = $this->gastosManager->reporteDeGastosPorArticulo(
            idarticulo: $idarticulo,
            periodos: $periodos,
            fechaDesde: $request->input('fecha_desde'),
            fechaHasta: $request->input('fecha_hasta'),
            sucursales: $sucursales
        );

        return response()->json($reporte->toArray());
    }

    /**
     * Reporte de rubro con su contexto de sucursales y periodos.
     *
     * Endpoint: GET /api/gastos/rubro/{idrubro}/contexto
     *
     * Path Parameters:
     * - idrubro: int (ID del rubro)
     *
     * Query Parameters:
     * - periodo_id: int (Opcional)
     * - fecha_desde: string (Opcional)
     * - fecha_hasta: string (Opcional)
     * - sucursales: int[] (Opcional)
     *
     * Json Response:
     * {
     *   "sucursales": [
     *     {
     *       "id": 1,
     *       "nombre": "Sucursal Centro",
     *       ...
     *     }
     *   ],
     *   "liquidacionperiodo": {
     *     "id": 10,
     *     "descripcion": "Mayo 2024",
     *     "cambio": 200,
 *     ...
     *   } | [ ... ] // Array of periods if no periodo_id is provided
     * }
     *
     * @param int $idrubro
     * @param ReporteGastosRequest $request
     * @return JsonResponse
     */
    public function getPeriodoContexto(int $idperiodo, ReporteGastosRequest $request): JsonResponse
    {

        $reporte = $this->gastosManager->getPeriodoContexto(
            idperiodo: $idperiodo
        );

        return response()->json($reporte);
    }

    /**
     * Obtiene el detalle de gastos filtrado por periodo, artículo y sucursal.
     *
     * Endpoint: GET /api/gastos/detalle
     *
     * Query Parameters:
     * - idperiodo: int (Requerido)
     * - idarticulo: int (Requerido)
     * - idsucursal: int (Requerido)
     *
     * Json Response:
     * [
     *   {
     *     "id": 789,
     *     "fecha": "2024-05-20",
     *     "comprobante": "0001-00001234",
     *     "importe": 500.00,
     *     "sucursal": "Sucursal Centro",
     *     "articulo": "Nombre del Articulo",
     *     "observaciones": "Alguna observación"
     *   },
     *   ...
     * ]
     *
     * @param GastoDetalleRequest $request
     * @return JsonResponse
     */
    public function detalle(GastoDetalleRequest $request): JsonResponse
    {
        $gastos = $this->gastosManager->getGastosDetalle(
            idperiodo: (int) $request->input('idperiodo'),
            idarticulo: (int) $request->input('idarticulo'),
            idsucursal: (int) $request->input('idsucursal')
        );

        return response()->json($gastos->toArray());
    }

    /**
     * Actualiza periodo de liquidación y artículo de un gasto (compra).
     *
     * Endpoint: PATCH /api/gastos/{id}
     *
     * Body:
     * - idperiodo: int (requerido)
     * - idperiodo_anterior: int (opcional)
     * - idarticulo: int (requerido)
     * - id_compra_detalle: int (requerido)
     * - idsucursal: int (requerido)
     * - importe: float (requerido)
     * - fecha_emision: string (requerido, formato YYYY-MM-DD)
     * - id_proveedor: int (requerido)
     * - observaciones: string (opcional)
     *
     * @param int $id ID del gasto (compra)
     * @param UpdateGastoRequest $request
     * @return JsonResponse
     */
    public function update(int $id, UpdateGastoRequest $request): JsonResponse
    {
        $this->gastosManager->updateGasto(new EditarGastoDTO(
            idCompra: $id,
            idCompraDetalle: (int)$request->input('id_compra_detalle'),
            idarticulo: (int)$request->input('idarticulo'),
            idperiodo: (int)$request->input('idperiodo'),
            idsucursal: (int)$request->input('idsucursal'),
            importe: (float)$request->input('importe'),
            fechaEmision: \Illuminate\Support\Carbon::parse($request->input('fecha_emision')),
            idProveedor: (int)$request->input('id_proveedor'),
            observaciones: $request->input('observaciones'),
            idperiodoAnterior: $request->filled('idperiodo_anterior')
                ? (int)$request->input('idperiodo_anterior')
                : null,
        ));

        return response()->json(['ok' => true]);
    }

    /**
     * Obtiene el historial de auditoría de un gasto.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: GET /api/gastos/{id}/historial
     *
     * Path Parameters:
     * - id: int (ID del gasto)
     *
     * Json Response:
     * [
     *   {
     *     "id": 1,
     *     "user_type": "App\\Models\\User",
     *     "user_id": 1,
     *     "event": "updated",
     *     "auditable_type": "App\\Models\\Gasto",
     *     "auditable_id": 10,
     *     "old_values": { "idsucursal": 1, "idproveedor": 5 },
     *     "new_values": { "idsucursal": 2, "idproveedor": 6 },
     *     "metadata": {
     *        "sucursal_old": { "id": 1, "nombre": "..." },
     *        "sucursal_new": { "id": 2, "nombre": "..." },
     *        "proveedor_old": { "id": 5, "nombre": "..." },
     *        "proveedor_new": { "id": 6, "nombre": "..." }
     *     },
     *     "url": "http://...",
     *     "ip_address": "127.0.0.1",
     *     "user_agent": "...",
     *     "tags": null,
     *     "created_at": "2024-06-26T14:05:00.000000Z",
     *     "updated_at": "2024-06-26T14:05:00.000000Z",
     *     "user": { "id": 1, "name": "Admin", ... }
     *   },
     *   ...
     * ]
     *
     * Reglas:
     * - Retorna auditorías del Gasto (Compra) y de sus GastoDetalle (ComprasDetalle).
     * - Ordenado por fecha de creación descendente.
     * - Incluye valores antiguos y nuevos del cambio.
     * - Si hay cambios en idsucursal, idproveedor o idarticulo, se cargan los modelos relacionados en el campo 'metadata'.
     */
    public function historial(int $id): JsonResponse
    {
        $historial = $this->gastosManager->getHistorial($id);

        return response()->json($historial);
    }
}
