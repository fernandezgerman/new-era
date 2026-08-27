<?php

namespace App\Http\Controllers\BalanceGeneral;

use App\Http\Controllers\BaseController;
use App\Http\Requests\BalanceGeneral\GetBalanceGeneralPorSucursalRequest;
use App\Http\Requests\BalanceGeneral\GetBalanceGeneralTotalizadoRequest;
use App\Models\LiquidacionPeriodo;
use App\Services\BalanceGeneral\BalanceGeneralManager;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use Illuminate\Support\Carbon;

class BalanceGeneralController extends BaseController
{
    /**
     * Obtiene el balance general totalizado para un rango de fechas y sucursales.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: GET /api/reportes/balance-general/totalizado
     *
     * Request Payload (Query Parameters / Body):
     * - dateFrom: string (Optional, Fecha de inicio en formato Y-m-d)
     * - dateTo: string (Optional, Fecha de fin en formato Y-m-d)
     * - idPeriodoLiquidacionDesde: integer (Optional, ID del periodo de liquidación inicial)
     * - idPeriodoLiquidacionHasta: integer (Optional, ID del periodo de liquidación final)
     * - sucursales: array (Optional, Array de IDs de sucursales)
     *
     * Example: /api/reportes/balance-general/totalizado?dateFrom=2026-08-01&dateTo=2026-08-25&sucursales[]=1
     * Example con periodos: /api/reportes/balance-general/totalizado?idPeriodoLiquidacionDesde=10&idPeriodoLiquidacionHasta=12&sucursales[]=1
     *
     * Json Response:
     * {
     *   "balanceGeneralFiltersDTO": {
     *     "dateFrom": "2026-08-01",
     *     "dateTo": "2026-08-25",
     *     "sucursales": [1],
     *     "priodosContables": null
     *   },
     *   "balanceGeneralItemDTOCollection": [
     *     {
     *       "tipo": "VENTAS",
     *       "balanceGeneralFiltersDTO": {
     *         "dateFrom": "2026-08-01",
     *         "dateTo": "2026-08-25",
     *         "sucursales": [1],
     *         "priodosContables": null
     *       },
     *       "total": 1500.50,
     *       "descripcion": "Total de ventas",
     *       "suma": true
     *     }
     *   ]
     * }
     *
     * Reglas:
     * - Se debe proporcionar dateFrom/dateTo o idPeriodoLiquidacionDesde/idPeriodoLiquidacionHasta.
     * - Si se proporcionan ambos, prevalecen las fechas explicitas (dateFrom/dateTo).
     * - sucursales es opcional y debe ser un array de enteros.
     *
     * @param GetBalanceGeneralTotalizadoRequest $request
     * @param BalanceGeneralManager $balanceGeneralManager
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTotalizado(
        GetBalanceGeneralTotalizadoRequest $request,
        BalanceGeneralManager $balanceGeneralManager
    ) {
        $dateFrom = $request->dateFrom;
        $dateTo = $request->dateTo;

        if (!$dateFrom && $request->idPeriodoLiquidacionDesde) {
            $periodo = LiquidacionPeriodo::findOrFail($request->idPeriodoLiquidacionDesde);
            $dateFrom = $periodo->fechahoradesde->addDay(1)->format('Y-m-d');
        } else {
            $dateFrom = Carbon::parse($dateFrom)->format('Y-m-d 00:00:00');
        }

        if (!$dateTo && $request->idPeriodoLiquidacionHasta) {
            $periodo = LiquidacionPeriodo::findOrFail($request->idPeriodoLiquidacionHasta);

            $dateTo = blank($periodo->fechahorahasta) ? new Carbon() : $periodo->fechahorahasta->format('Y-m-d').' 23:59:59';
        } else {
            $dateTo = Carbon::parse($dateTo)->format('Y-m-d 23:59:59');
        }

        $filters = new BalanceGeneralFiltersDTO(
            dateFrom: Carbon::parse($dateFrom),
            dateTo: Carbon::parse($dateTo),
            sucursales: $request->sucursales,
            priodosContables: null
        );

        $balanceGeneral = $balanceGeneralManager->getBalanceGeneral($filters);

        return response()->json($balanceGeneral->toArray());
    }

    /**
     * Obtiene el balance general agrupado por sucursal para un rango de fechas y sucursales.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: GET /api/reportes/balance-general/por-sucursal
     *
     * Request Payload (Query Parameters / Body):
     * - dateFrom: string (Optional, Fecha de inicio en formato Y-m-d)
     * - dateTo: string (Optional, Fecha de fin en formato Y-m-d)
     * - idPeriodoLiquidacionDesde: integer (Optional, ID del periodo de liquidación inicial)
     * - idPeriodoLiquidacionHasta: integer (Optional, ID del periodo de liquidación final)
     * - sucursales: array (Optional, Array de IDs de sucursales)
     *
     * Example: /api/reportes/balance-general/por-sucursal?dateFrom=2026-08-01&dateTo=2026-08-25&sucursales[]=1
     *
     * Json Response:
     * {
     *   "balanceGeneralFiltersDTO": {
     *     "dateFrom": "2026-08-01",
     *     "dateTo": "2026-08-25",
     *     "sucursales": [1],
     *     "priodosContables": null
     *   },
     *   "result": {
     *     "1": [
     *       {
     *         "tipo": "VENTAS",
     *         "balanceGeneralFiltersDTO": {
     *           "dateFrom": "2026-08-01",
     *           "dateTo": "2026-08-25",
     *           "sucursales": [1],
     *           "priodosContables": null
     *         },
     *         "sucursalId": 1,
     *         "total": 1500.50,
     *         "descripcion": "Total de ventas",
     *         "suma": true
     *       }
     *     ]
     *   }
     * }
     *
     * @param GetBalanceGeneralPorSucursalRequest $request
     * @param BalanceGeneralManager $balanceGeneralManager
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPorSucursal(
        GetBalanceGeneralPorSucursalRequest $request,
        BalanceGeneralManager $balanceGeneralManager
    ) {
        $dateFrom = $request->dateFrom;
        $dateTo = $request->dateTo;

        if (!$dateFrom && $request->idPeriodoLiquidacionDesde) {
            $periodo = LiquidacionPeriodo::findOrFail($request->idPeriodoLiquidacionDesde);
            $dateFrom = $periodo->fechahoradesde->addDay(1)->format('Y-m-d').' 00:00:01';
        } else {
            $dateFrom = Carbon::parse($dateFrom)->format('Y-m-d 00:00:00');
        }

        if (!$dateTo && $request->idPeriodoLiquidacionHasta) {
            $periodo = LiquidacionPeriodo::findOrFail($request->idPeriodoLiquidacionHasta);

            $dateTo = blank($periodo->fechahorahasta) ? new Carbon() : $periodo->fechahorahasta->format('Y-m-d').' 23:59:59';
        } else {
            $dateTo = Carbon::parse($dateTo)->format('Y-m-d'). ' 23:59:59';
        }

        $filters = new BalanceGeneralFiltersDTO(
            dateFrom: Carbon::parse($dateFrom),
            dateTo: Carbon::parse($dateTo),
            sucursales: $request->sucursales,
            priodosContables: null
        );

        $balanceGeneral = $balanceGeneralManager->getBalancePorPeriodoPorSucursal($filters);

        return response()->json($balanceGeneral->toArray());
    }
}
