<?php

namespace App\Services\Alertas\DataAccessors;

use App\DataAccessor\CajasDataAccessor;
use App\DataAccessor\SolicitudDePagoDataAccessor;
use App\Models\Alerta;
use App\Models\AlertaTipo;
use App\Models\Caja;
use App\Services\Alertas\Collections\AlertaDetalleCollection;
use App\Services\Alertas\Collections\AlertasSummaryCollection;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use App\Services\Alertas\Exceptions\NotImplementedException;
use App\Services\Alertas\Factories\AlertaDetalleDTOFactory;
use App\Services\Alertas\Factories\MovimientosDeCajaSummaryFactory;
use App\Services\Alertas\Factories\SolicitudesDePagoSummaryFactory;
use App\Services\Alertas\Factories\TareasSummaryFactory;
use App\Services\TareasManager\DataAccessors\TareasDataAccessor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AlertasDataAccessor extends \App\DataAccessor\DataAccessorBase
{
    const ALERTA_TIPO_MENSAJES_ID = 3;
    const ALERTA_TIPO_MOVIMIENTOS_ID = 1;

    public function __construct()
    {

    }

    private function getMisssingAlertaTipo(AlertasSummaryCollection $alertasCollection): AlertasSummaryCollection
    {

        $ids = $alertasCollection->map(
            fn($alerta) => $alerta->alertaTipo->id
        )->toArray();

        //Exclude mensajes by now
        $ids[] = self::ALERTA_TIPO_MENSAJES_ID;

        $alertas = AlertaTipo::query()->whereNotIn('id', $ids)
            ->get()
            ->map(function ($alertaTipo) {
                return new AlertaSummaryDTO(0, $alertaTipo->id);
            });

        return new AlertasSummaryCollection($alertas);
    }

    public function getAlertasSummary(int $usuarioId, ?int $alertaTipoId): AlertasSummaryCollection
    {
        $arr = session('permisos');

        $alertasPermitido = !(Arr::get($arr, 'alrtgral', 'PERMITIDO') === "RESTRINGIDO");
        $alertasDeSolicitudesDePagoPermitido = !(Arr::get($arr, 'pgsscrsl', 'PERMITIDO') === "RESTRINGIDO");
        $puedeAgregarMovimientosDeCaja = !(Arr::get($arr, 'agrmovcaja', 'PERMITIDO') === "RESTRINGIDO");

        $alertasCollection = new Collection();

        //Filtra aertas por precios y arreglos
        if ($alertasPermitido) {
            $alertasSummary = AlertaTipo::query()
                ->selectRaw("
                    COUNT(1) AS cantidad,
                    alertastipos.id AS idalertatipo,
                    SUM(IF(alertas.color = 'NEGRO' AND fechahoravisto is null, 1, 0)) AS negro,
                    SUM(IF((alertas.color = 'AZUL' OR alertas.color IS NULL) AND fechahoravisto is null AND not alertas.id  is null, 1, 0)) AS azul,
                    SUM(IF(alertas.color = 'VERDE' AND fechahoravisto is null, 1, 0)) AS verde,
                    SUM(IF(alertas.color = 'ROJO' AND fechahoravisto is null, 1, 0)) AS rojo,
                    SUM(IF(alertas.color = 'AMARILLO' AND fechahoravisto is null, 1, 0)) AS amarillo,
                    0 AS violeta
                ")
                ->leftjoin('alertas', 'alertas.idalertatipo', '=', 'alertastipos.id')
                ->leftjoin('alertasdestinatarios', 'alertas.id', '=', 'alertasdestinatarios.idalerta')
                ->where(function (Builder $query) use ($usuarioId) {
                    $query->where('idusuario', $usuarioId);
                    $query->orWhereNull('alertas.id');
                })
                ->whereIn('alertastipos.id', [2, 4])

                //->where('fechahoravisto', null)
                ->groupBy('alertastipos.id');

            if ($alertaTipoId !== null) {
                $alertasSummary->where('idalertatipo', $alertaTipoId);
            };

            $alertasCollection = $alertasSummary
                ->get();

            $alertasCollection = $alertasCollection->map(function ($alerta) {
                return new AlertaSummaryDTO(
                    (int)$alerta->cantidad,
                    (int)$alerta->idalertatipo,
                    (int)$alerta->negro,
                    (int)$alerta->azul,
                    (int)$alerta->verde,
                    (int)$alerta->rojo,
                    (int)$alerta->amarillo
                );
            });
        }
        //Toma las alertas de Tareas

        try {
            $tareas = TareasSummaryFactory::makeFromUserId($usuarioId);
            $alertasCollection->add($tareas);
        } catch (\Exception $exception) {
            Log::error('Error al cargar alertas de tareas: ' . $exception->getMessage());
        }
        if ($puedeAgregarMovimientosDeCaja) {
            //Toma los movimientos de la ultima caja
            $movimientosUltimoCaja = MovimientosDeCajaSummaryFactory::makeFromMovimientos(
                app(CajasDataAccessor::class)
                    ->getMovimientosUltimaCaja(
                        $usuarioId,
                        config('general.central_sucursal_id')
                    ), $usuarioId);;

            $alertasCollection->add($movimientosUltimoCaja);
        }


        if ($alertasDeSolicitudesDePagoPermitido) {

            // Agrega resumen de Solicitudes de Pago (alerta tipo 6)
            $solicitudesPagoSummary = SolicitudesDePagoSummaryFactory::makeFromUserId($usuarioId);
            $alertasCollection->add($solicitudesPagoSummary);
        }

        $alertas = new AlertasSummaryCollection($alertasCollection);
        //Muestra los missed alertas en el menu
        /* $missingAlertas = $this->getMisssingAlertaTipo($alertas);
         $merged = $alertas->merge($missingAlertas); */

        $merged = $alertas;
        // Order by alertaTipo->codigo ascending
        $sorted = $merged->sortBy(function ($item) {
            /** @var \App\Services\Alertas\DTOs\AlertaSummaryDTO $item */
            return $item->alertaTipo->codigo;
        })->values();


        return new AlertasSummaryCollection($sorted);
    }

    /**
     * @param int $usuarioId
     * @param int $idAlertaDetalleTipo
     * @return AlertaSummaryDTO
     * @throws NotImplementedException
     */
    public function getAlertaDetalles(int $usuarioId, int $idAlertaDetalleTipo): AlertaDetalleCollection
    {
        $data = match ($idAlertaDetalleTipo) {
            config('alertas.solicitud_de_pago_alerta_id') =>
            (app(SolicitudDePagoDataAccessor::class)->getSolicitudesDePagoAlertas($usuarioId))
                ->map(fn($solicitudDePago) => AlertaDetalleDTOFactory::makeFromSolicitudPago($solicitudDePago)),
            config('alertas.tareas_alerta_id') =>
            (app(TareasDataAccessor::class)->getTareas($usuarioId))
                ->map(fn($tarea) => AlertaDetalleDTOFactory::makeFromTareas($tarea)),
            default => throw new NotImplementedException('Detalle de alerta solo disponible para solicitudes de pago. Refiera a legacy version para otras alertas.'),
        };

        return new AlertaDetalleCollection($data);
    }
}
