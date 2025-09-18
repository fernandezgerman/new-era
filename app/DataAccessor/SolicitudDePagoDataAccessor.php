<?php

namespace App\DataAccessor;

use App\Models\SolicitudDePago;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class SolicitudDePagoDataAccessor extends DataAccessorBase
{
    public function getSolicitudesDePagoAlertas(int $usuarioId): Collection
    {
        $query = SolicitudDePago::query()
            ->select(DB::raw('solicitudespago.*'))
            ->join(DB::raw('(SELECT MAX(id) as ultimoid, idsolicitudpago FROM solicitudespagoestados GROUP BY idsolicitudpago) as ueid'), function ($join) {
                $join->on('solicitudespago.id', '=', 'ueid.idsolicitudpago');
            })
            ->join('solicitudespagoestados as spe', function ($join) {
                $join->on('solicitudespago.id', '=', 'spe.idsolicitudpago')
                    ->on('ueid.ultimoid', '=', 'spe.id');
            })
            ->join('usuariossucursales as us', 'solicitudespago.idsucursal', '=', 'us.idsucursal')
            ->where('us.activo', 1)
            ->where('us.idusuario', $usuarioId)
            ->where(function ($w) {
                $w->where('spe.estado', 'PENDIENTE')
                    ->orWhere(function ($w2) {
                        $w2->whereIn('spe.estado', ['CADUCADA', 'RECHAZADA', 'APROBADA'])
                            ->whereRaw('DATE(NOW()) < DATE_ADD(spe.fechahora, INTERVAL 1 DAY)');
                    });
            });

        return $query->get();
    }
}
