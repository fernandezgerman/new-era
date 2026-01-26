<?php

namespace App\Services\MovimientosDeCaja;

use App\Models\Caja;
use App\Models\MovimientoCaja;
use App\Models\MovimientoCajaEstado as MovimientoCajaEstadoLog;
use App\Models\MotivoMovimientoCaja;
use App\Models\Sucursal;
use App\Models\User;
use App\Services\Actualizaciones\ActualizacionesManager;
use App\Services\Cajas\CajaManager;
use App\Services\MovimientosDeCaja\Enums\MovimientoCajaEstados;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Nette\Schema\ValidationException;

class MovimientosCajaManager
{
    public function __construct(private ActualizacionesManager $actualizacionesManager, private CajaManager $cajaManager)
    {
    }

    private function validateUsuarioAbreCajaEnSucursal(int $usuarioDestinoId, int $sucursalDestinoId): void
    {
        /** @var User|null $userDest */
        $userDest = User::query()->find($usuarioDestinoId);
        $destOk = $userDest?->sucursalesCaja()
            ->where('sucursales.id', $sucursalDestinoId)
            ->exists();

        if (!$destOk) {
            $suc = Sucursal::query()->find($sucursalDestinoId);
            $nombreSuc = $suc?->nombre ?? (string)$sucursalDestinoId;
            throw new ValidationException('ATENCION! No se pudo insertar el movimiento. EL usuario '.$userDest->nombre. ' '.$userDest->apellido.' no puede abrir caja en ' . $nombreSuc);
        }
    }
    public function createMovimientosCaja(
        int   $sucursalOrigenId,
        int   $usuarioOrigenId,
        int   $motivoMovimientoId,
        float $importe,
        int   $sucursalDestinoId = null,
        int   $usuarioDestinoId = null,
        ?string $observaciones = null,
        ?Carbon $fechaHoraMovimiento = null,
        MovimientoCajaEstados $estado = MovimientoCajaEstados::PENDIENTE): MovimientoCaja
    {
        // Variables según SP original
        $requiereAprobacion = 0;
        $esRetiro = 0;
        $esAporte = 0;
        $numeroCajaDestino = null;
        $numeroCajaOrigen = null;

        // Lee banderas del motivo usando modelo
        $motivo = MotivoMovimientoCaja::query()->find($motivoMovimientoId);

        if ($motivo) {
            $requiereAprobacion = abs((int)($motivo->requiereaprobacion ?? 0));
            $esRetiro = (int)($motivo->esretirodecaja ?? 0);
            $esAporte = (int)($motivo->esaportedecaja ?? 0);
        }

        // Valida que el destinatario pueda abrir caja en sucursal destino (salvo retiros) usando relaciones
        if (!$esRetiro) {
            $this->validateUsuarioAbreCajaEnSucursal($usuarioDestinoId, $sucursalDestinoId);
        }

        //Si no requiere aprobacion o es retiro o aporte
        $estadoFinal = ($esRetiro === 1 || $esAporte === 1) ? MovimientoCajaEstados::APROBADO : $estado;
        $estadoFinal = (!($requiereAprobacion === 1) && $estadoFinal ===  MovimientoCajaEstados::PENDIENTE)
            ? MovimientoCajaEstados::APROBADO : $estadoFinal;


        if($estadoFinal !== MovimientoCajaEstados::PENDIENTE)
        {

            $numeroCajaDestino = !empty($usuarioDestinoId) && $esRetiro === 0 && $sucursalDestinoId === config('general.central_sucursal_id')
                ? $this->cajaManager->getCajaAbierta($usuarioDestinoId, $sucursalDestinoId)->numero
                : null;

            $numeroCajaOrigen = $esAporte === 0 && $sucursalOrigenId === config('general.central_sucursal_id')
                ? $this->cajaManager->getCajaAbierta($usuarioOrigenId, $sucursalOrigenId)->numero
                : null;
        }

        // Fecha/hora del movimiento
        $fechaActual = ($fechaHoraMovimiento ?? Carbon::now())->format('Y-m-d H:i:s');

        // Inserta movimiento y su estado atómico
        return DB::transaction(function () use (
            $usuarioOrigenId,
            $sucursalOrigenId,
            $motivoMovimientoId,
            $numeroCajaOrigen,
            $numeroCajaDestino,
            $fechaActual,
            $importe,
            $estadoFinal,
            $observaciones,
            $usuarioDestinoId,
            $sucursalDestinoId
        ) {
            /** @var MovimientoCaja $mov */
            $mov = MovimientoCaja::query()->create([
                'idusuario' => $usuarioOrigenId,
                'idsucursal' => $sucursalOrigenId,
                'idmotivo' => $motivoMovimientoId,
                'numerocaja' => $numeroCajaOrigen,
                'numerocajadestino' => $numeroCajaDestino,
                'fechahoramovimiento' => $fechaActual,
                'fechahorarecibida' => null,
                'importe' => $importe,
                'idestado' => $estadoFinal->value,
                'idusuariodestino' => $usuarioDestinoId,
                'idsucursaldestino' => $sucursalDestinoId,
            ]);

            MovimientoCajaEstadoLog::query()->create([
                'idusuario' => $usuarioOrigenId,
                'idsucursal' => $sucursalOrigenId,
                'idestado' => $estadoFinal->value,
                'fechahoraestado' => $fechaActual,
                'fechahoramovimiento' => $fechaActual,
                'descripcionestado' => $observaciones,
            ]);

            // Inserta actualizaciones para ambas sucursales segun SP
            if (!empty($sucursalDestinoId)) {
                $this->actualizacionesManager->insertarActualizacion($mov, Sucursal::query()->find($sucursalDestinoId));
            }
            $this->actualizacionesManager->insertarActualizacion($mov, Sucursal::query()->find($sucursalOrigenId));

            return $mov;
        });
    }
}

