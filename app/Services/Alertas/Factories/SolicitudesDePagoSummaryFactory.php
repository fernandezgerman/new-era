<?php

namespace App\Services\Alertas\Factories;

use App\Services\Alertas\DataAccessors\AlertasDataAccessor;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SolicitudesDePagoSummaryFactory
{
    public static function makeFromUserId(int $usuarioId): AlertaSummaryDTO
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
}
