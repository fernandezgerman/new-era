<?php

namespace App\Http\Controllers\MovimientosCaja;

use App\DataAccessor\MedioDeCobroSucursalConfiguracionDataAccessor;
use App\Http\ApiResources\ApiResourceBase;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Api\ApiResourceBaseGetEntity;
use App\Http\Requests\Api\GetMovimientosCajaTotalizado;
use App\Http\Requests\MediosDePago\GenerateOrderByDataRequest;
use App\Http\Requests\MediosDePago\GenerateOrderRequest;
use App\Http\Requests\MediosDePago\OrderPreviewRequest;
use App\Http\Requests\MediosDePago\ReembolsarOrderByDataRequest;
use App\Http\Requests\MediosDePago\TestConnectionRequest;
use App\Http\Requests\Caja\ReporteMercadoPagoRequest;
use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Models\ModoDeCobro;
use App\Models\MovimientoCaja;
use App\Models\Sucursal;
use App\Models\VentaSucursalCobro;
use App\Services\Alertas\AlertasManager;
use App\Services\AsyncProcess\AsyncProcessManager;
use App\Services\AsyncProcess\DTOs\MercadoPago\AsyncProcessProcesarEventoDTO;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoCajaDTOFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver;
use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;
use App\Services\MediosDeCobro\Factories\OrderDTOFactory;
use App\Services\MediosDeCobro\ModosDeCobroManager;
use App\Services\QueryResolvers\Queries\ReporteMercadoPago\DTOs\ReporteMercadoPagoQueryResolverFilters;
use App\Services\QueryResolvers\Queries\ReporteMercadoPago\ReporteMercadoPagoResolver;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Throwable;


class MovimientosCajaController extends BaseController
{

    /**
     * Get totalized movements by reason.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: GET /api/movimientos-caja/totalizado
     *
     * Request Payload (Query Parameters):
     * - filtros: array (Opcional, Filtros para la consulta. Ejemplo: {"idsucursal": 1})
     *
     * Example: /api/movimientos-caja/totalizado?filtros={"idsucursal":1}
     *
     * Json Response:
     * [
     *   {
     *     "idmotivo": 12,
     *     "total": "76940269.560",
     *     "motivo": "Pago de gastos",
     *   },
     *   ...
     * ]
     *
     * Reglas:
     * - Sumariza los importes de los movimientos agrupados por motivo.
     * - Solo considera movimientos con estado 'Aprobado' (idestado = 2).
     *
     * @param GetMovimientosCajaTotalizado $request
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getMovimientosTotalizados(GetMovimientosCajaTotalizado $request)
    {

        $filtros = $request->validated('filtros') ?? [];

        $query = MovimientoCaja::query()
            ->join('motivosmovimientoscaja', 'motivosmovimientoscaja.id', '=', 'movimientoscaja.idmotivo');

        $query->select( 'movimientoscaja.idmotivo', db::raw('sum(importe) as total'),'motivosmovimientoscaja.descripcion as motivo' );

        foreach ($filtros as $key => $value) {
            if (is_array($value) && array_is_list($value)) {
                foreach ($value as $condition) {
                    ApiResourceBase::applyFiltroCondition($query, $key, $condition);
                }
            } elseif (is_array($value)) {
                ApiResourceBase::applyFiltroCondition($query, $key, $value);
            } else {
                $query->where($key, $value);
            }
        }
        $query->where('idestado', 2);

        $query->groupBy( 'movimientoscaja.idmotivo','motivosmovimientoscaja.descripcion' );

        return $query->get();
    }
    public function getMovimientosCajaPendientesParaLiq(int $idsucursal)
    {
        return app(AlertasManager::class)->AlertasPreLiquidacion(Sucursal::findOrFail($idsucursal));
    }

    /**
     * Get Mercado Pago report.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: POST /api/movimientos-caja/reporte-mercado-pago
     *
     * Request Payload (Body):
     * - sucursal_id: int (Requerido, ID de la sucursal)
     * - fecha_hora_desde: string (Requerido, Formato YYYY-MM-DD HH:MM:SS)
     * - fecha_hora_hasta: string (Requerido, Formato YYYY-MM-DD HH:MM:SS)
     *
     * Json Response:
     * [
     *   {
     *     "id": 1,
     *     "tipo": "movimiento|compra",
     *     "fechahoramovimiento": "2023-01-01 10:00:00",
     *     "importe": 1500.50
     *   },
     *   ...
     * ]
     *
     * Reglas:
     * - Retorna una unión de movimientos de caja y compras asociadas a Mercado Pago.
     * - Filtrado por sucursal y rango de fecha/hora.
     *
     * @param ReporteMercadoPagoRequest $request
     * @return \Illuminate\Support\Collection
     */
    public function getReporteMercadoPago(ReporteMercadoPagoRequest $request)
    {
        $filters = new ReporteMercadoPagoQueryResolverFilters(
            sucursal: Sucursal::findOrFail($request->sucursal_id),
            fechaHoraDesde: Carbon::parse($request->fecha_hora_desde),
            fechaHoraHasta: Carbon::parse($request->fecha_hora_hasta)
        );

        return (new ReporteMercadoPagoResolver($filters))->getData();
    }
}
