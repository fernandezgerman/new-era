<?php

namespace App\Services\Alertas;

use App\Models\Alerta;
use App\Models\MovimientoCaja;
use App\Models\Sucursal;
use App\Models\User;
use App\Services\Cache\CacheManager;
use App\Services\Cache\Enums\CacheExpire;
use App\Services\MovimientosDeCaja\Enums\MovimientoCajaEstados;
use DB;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AlertasManager extends CacheManager
{
    public function MarcarAlertasComoLeidas(User $user, array $alertaTipoId = null, int $alertaId = null, $marcarComoLeida = true): void
    {

        if ($alertaTipoId === null && $alertaId === null) {
            throw new \Exception('Debe especificar al menos un tipo de alerta o un id de alerta para amrcarlas como leidas');
        }

        $query = Alerta::query()
            ->join('alertasdestinatarios', 'alertasdestinatarios.idalerta', '=', 'alertas.id')
            ->where('idusuario', $user->id);

        if ($alertaTipoId) {
            $query->where('idalertatipo', $alertaTipoId);
        }

        if ($alertaId) {
            $query->where('alertas.id', $alertaId);
        }

        $query->update(['fechahoravisto' => $marcarComoLeida ? now() : null]);
    }

    public function AlertasPreLiquidacion(Sucursal $sucursal): array
    {
        $unaSemanasAtras = Carbon::now()->subWeeks(10);

        $minMovimientoId = $this->Cache(
            ['min_movimiento_id_since', $unaSemanasAtras->format('Y-m-d')],
            CacheExpire::NEXT_MONDAY,
            function () use ($unaSemanasAtras) {
                $movimientoId = MovimientoCaja::query()
                    ->where('fechahoramovimiento', '>=', $unaSemanasAtras->format('Y-m-d'))
                    ->select(db::raw('min(id) as id'))->first();

                return $movimientoId ? $movimientoId->id : 0;
            }
        );

        return [
            'movimientosCaja' =>
                MovimientoCaja::query()
                    ->with('sucursal', 'sucursalDestino', 'usuario', 'usuarioDestino', 'motivo')
                    ->where(function ($query) use ($sucursal) {
                        $query->where(function ($query) use ($sucursal) {
                            $query->whereNot('idsucursal', $sucursal->id)
                                ->where('idsucursaldestino', $sucursal->id);
                        });
                        /*
                        $query->where(function ($query) use ($sucursal) {
                            $query->where('idsucursal', $sucursal->id)
                                ->whereNot('idsucursaldestino', $sucursal->id);
                        });

                        $query->orWhere(function ($query) use ($sucursal) {
                            $query->where('idsucursaldestino', $sucursal->id)
                                ->whereNot('idsucursal', $sucursal->id);
                        });*/
                    })
                    ->where('id', '>', $minMovimientoId)
                    ->where('idestado', MovimientoCajaEstados::PENDIENTE->value)
                    ->get()
        ];
    }
}
