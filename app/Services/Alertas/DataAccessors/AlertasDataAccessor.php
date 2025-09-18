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
        $alertasSummary = Alerta::query()
            ->selectRaw("
                COUNT(1) AS cantidad,
                alertas.idalertatipo AS idalertatipo,
                SUM(IF(alertas.color = 'NEGRO', 1, 0)) AS negro,
                SUM(IF(alertas.color = 'AZUL' OR alertas.color IS NULL, 1, 0)) AS azul,
                SUM(IF(alertas.color = 'VERDE', 1, 0)) AS verde,
                SUM(IF(alertas.color = 'ROJO', 1, 0)) AS rojo,
                SUM(IF(alertas.color = 'AMARILLO', 1, 0)) AS amarillo,
                0 AS violeta
            ")
            ->join('alertasdestinatarios', 'alertas.id', '=', 'alertasdestinatarios.idalerta')
            ->where('idusuario', $usuarioId)
            ->where('fechahoravisto', null)
            ->groupBy('alertas.idalertatipo');

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

        //Toma los movimientos de la ultima caja
        $movimientosUltimoCaja = $this->transformMovimientosToAlertaSummary(
            app(CajasDataAccessor::class)
                ->getMovimientosUltimaCaja(
                    $usuarioId,
                    config('general.central_sucursal_id')
                ), $usuarioId);;
        $alertasCollection->add($movimientosUltimoCaja);

        // Agrega resumen de Solicitudes de Pago (alerta tipo 6)
        $solicitudesPagoSummary = $this->getSolicitudesPagoSummary($usuarioId);
        $alertasCollection->add($solicitudesPagoSummary);

        $alertas = new AlertasSummaryCollection($alertasCollection);
        //Muestra los missed alertas en el menu
        $missingAlertas = $this->getMisssingAlertaTipo($alertas);
        $merged = $alertas->merge($missingAlertas);

        // Order by alertaTipo->codigo ascending
        $sorted = $merged->sortBy(function ($item) {
            /** @var \App\Services\Alertas\DTOs\AlertaSummaryDTO $item */
            return $item->alertaTipo->codigo;
        })->values();
        return new AlertasSummaryCollection($sorted);
    }

    private function transformMovimientosToAlertaSummary(Collection $movimientos, int $usuarioId): AlertaSummaryDTO
    {
        $alertaSummary = new AlertaSummaryDTO(null, self::ALERTA_TIPO_MOVIMIENTOS_ID);

        /** @var AlertaSummaryDTO $alertaSummary */
        $alertaSummary = $movimientos->reduce(function ($carry, $movimiento) use ($usuarioId) {
            $carry->cantidad++;
            $carry->negro += (int)$movimiento->idestado === 1 && $movimiento->idusuario === $usuarioId ? 1 : 0;
            $carry->azul += (int)$movimiento->idestado === 1 && $movimiento->idusuariodestino === $usuarioId ? 1 : 0;
            $carry->verde += (int)$movimiento->idestado === 2 && $movimiento->idusuario === $usuarioId ? 1 : 0;
            $carry->rojo += (int)$movimiento->idestado === 3 && $movimiento->idusuario === $usuarioId ? 1 : 0;
            $carry->amarillo = 0;
            $carry->violeta = 0;

            return $carry;

        }, $alertaSummary);

        return $alertaSummary;
    }

    private function getSolicitudesPagoSummary(int $usuarioId): AlertaSummaryDTO
    {
        // Alerta tipo 6 segun requerimiento
        $alertaTipoId = config( 'alertas.solicitud_de_pago_alerta_id');

        $query = DB::table('solicitudespago as sdp')
            ->selectRaw('
                SUM(IF(spe.estado = "PENDIENTE",1,0)) as azul,
                SUM(IF(spe.estado = "CADUCADA",1,0)) as violeta,
                SUM(IF(spe.estado = "RECHAZADA",1,0)) as rojo,
                SUM(IF(spe.estado = "APROBADA",1,0)) as verde
            ')
            ->join(DB::raw('(SELECT MAX(id) as ultimoid, idsolicitudpago FROM solicitudespagoestados GROUP BY idsolicitudpago) as ueid'), function ($join) {
                $join->on('sdp.id', '=', 'ueid.idsolicitudpago');
            })
            ->join('solicitudespagoestados as spe', function ($join) {
                $join->on('sdp.id', '=', 'spe.idsolicitudpago')
                    ->on('ueid.ultimoid', '=', 'spe.id');
            })
            ->join('usuariossucursales as us', 'sdp.idsucursal', '=', 'us.idsucursal')
            ->where('us.activo', 1)
            ->where('us.idusuario', $usuarioId)
            ->where(function ($w) {
                $w->where('spe.estado', 'PENDIENTE')
                  ->orWhere(function ($w2) {
                      $w2->whereIn('spe.estado', ['CADUCADA', 'RECHAZADA', 'APROBADA'])
                         ->whereRaw('DATE(NOW()) < DATE_ADD(spe.fechahora, INTERVAL 1 DAY)');
                  });
            });

//        Log::info(query_builder_to_raw_sql($query));
        $row = $query->first();

        $dto = new AlertaSummaryDTO(0, $alertaTipoId);
        if ($row) {
            $dto->azul = (int)($row->azul ?? 0);
            $dto->violeta = (int)($row->violeta ?? 0);
            $dto->rojo = (int)($row->rojo ?? 0);
            $dto->verde = (int)($row->verde ?? 0);
            $dto->amarillo = 0;
            $dto->negro = 0;
            $dto->cantidad = $dto->azul + $dto->violeta + $dto->rojo + $dto->verde + $dto->amarillo + $dto->negro;
        } else {
            $dto->cantidad = 0;
        }

        return $dto;
    }

    /**
     * @param int $usuarioId
     * @param int $idAlertaDetalleTipo
     * @return AlertaSummaryDTO
     * @throws NotImplementedException
     */
    public function getAlertaDetalles(int $usuarioId, int $idAlertaDetalleTipo): AlertaDetalleCollection
    {
        if(config( 'alertas.solicitud_de_pago_alerta_id') !== $idAlertaDetalleTipo)
        {
            throw new NotImplementedException('Detalle de alerta solo disponible para solicitudes de pago. Refiera a legacy version para otras alertas.');
        }

        $solicitudesPagoAlerta = app(SolicitudDePagoDataAccessor::class)
            ->getSolicitudesDePagoAlertas($usuarioId);

        return new AlertaDetalleCollection(
            $solicitudesPagoAlerta->map(fn($solicitudDePago) => AlertaDetalleDTOFactory::makeFromSolicitudPago($solicitudDePago))
        );
    }
}
