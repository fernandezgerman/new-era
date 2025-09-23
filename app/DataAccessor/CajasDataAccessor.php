<?php

namespace App\DataAccessor;

use App\Models\Caja;
use App\Models\MovimientoCaja;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CajasDataAccessor extends DataAccessorBase
{
    public function __construct()
    {

    }

    public function getMovimientosUltimaCaja(int $usuarioId, int $sucursalId): ?Collection
    {
        $ultimaCaja = Caja::query()
            ->where('idusuario', $usuarioId)
            ->where('idsucursal', $sucursalId)
            ->orderBy('numero', 'desc')
            ->first();

        $numeroCaja = $ultimaCaja->numero ?? 0;
        $fechaHoraApertura = $ultimaCaja->fechaapertura ?? '1970-01-01';

        $query = MovimientoCaja::query()
            ->select(db::raw("
                    movimientoscaja.idusuario,
                    movimientoscaja.idusuariodestino,
                    movimientoscaja.idsucursal,
                    movimientoscaja.idmotivo,
                    movimientoscaja.numerocaja,
                    movimientoscaja.numerocajadestino,
                    movimientoscaja.fechahoramovimiento,
                    movimientoscaja.fechahorarecibida,
                    movimientoscaja.enviada,
                    movimientoscaja.importe,
                    movimientoscaja.idestado,
                    movimientoscaja.idsucursaldestino
            "))
            ->Join('movimientoscajaestado', function (JoinClause $join) use ($fechaHoraApertura) {
                $join
                    ->on('movimientoscajaestado.idusuario', '=', 'movimientoscaja.idusuario')
                    ->on('movimientoscajaestado.fechahoramovimiento', '=', 'movimientoscaja.fechahoramovimiento')
                    ->on('movimientoscajaestado.idsucursal', '=', 'movimientoscaja.idsucursal');
                    //->on('movimientoscajaestado.fechahoraestado', '>=', DB::raw("'$fechaHoraApertura'"));
            })
            ->where(function ($query) use ($usuarioId, $sucursalId, $numeroCaja, $fechaHoraApertura) {
                $query->where('movimientoscaja.idusuario', $usuarioId);
                $query->where('movimientoscaja.idsucursal', $sucursalId);
                $query->where(function ($query) use ($usuarioId, $sucursalId, $numeroCaja, $fechaHoraApertura) {
                    $query->where(function ($query) use ($usuarioId, $sucursalId, $numeroCaja) {
                        $query->where('movimientoscaja.idestado', 2);
                        $query->where('movimientoscaja.numerocaja', $numeroCaja);
                    });
                    $query->orWhere('movimientoscaja.idestado', 1);
                    $query->orWhere(function ($query) use ($usuarioId, $sucursalId, $numeroCaja, $fechaHoraApertura) {
                        $query->where('movimientoscaja.idestado', 3);
                        $query->where('movimientoscajaestado.fechahoraestado', '>=', $fechaHoraApertura);
                    });
                });
            })
            ->orWhere(function ($query) use ($usuarioId, $sucursalId, $numeroCaja, $fechaHoraApertura) {
                $query->where('movimientoscaja.idusuariodestino', $usuarioId);
                $query->where('movimientoscaja.idestado', 1);
                $query->where('movimientoscaja.idsucursaldestino', 2);
            })
            ->groupBy(DB::raw("
                    movimientoscaja.idusuario,
                    movimientoscaja.idusuariodestino,
                    movimientoscaja.idsucursal,
                    movimientoscaja.idmotivo,
                    movimientoscaja.numerocaja,
                    movimientoscaja.numerocajadestino,
                    movimientoscaja.fechahoramovimiento,
                    movimientoscaja.fechahorarecibida,
                    movimientoscaja.enviada,
                    movimientoscaja.importe,
                    movimientoscaja.idestado,
                    movimientoscaja.idsucursaldestino
            "));

        Log::info(json_encode(query_builder_to_raw_sql($query)));
        return $query->get();
    }
}
