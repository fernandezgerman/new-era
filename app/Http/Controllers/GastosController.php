<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReporteGastosRequest;
use App\Models\LiquidacionPeriodo;
use App\Models\Sucursal;
use App\Services\GastosManager;
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
     *     "sucursales_per_periodo": 5
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
     *     "sucursales_per_periodo": 5
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
     * Reporte de gastos para un artículo específico, sin agrupar.
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
     *     "periodoId": 1
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
}
