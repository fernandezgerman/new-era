<?php

namespace App\Services\Cajas;

use App\Models\Caja;
use App\Models\Sucursal;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CajaManager
{
    public const CAJA_ABIERTA = 0;

    public const CAJA_CERRADA = 1;
    /**
     * Obtiene el número de caja abierta para un usuario en una sucursal.
     * Si no existe una caja abierta, crea una nueva siguiendo la lógica del SP `getNumeroCaja`.
     */
    public function getCajaAbierta(int $usuarioId, int $sucursalId): Caja
    {
        // ¿Existe alguna caja que no esté cerrada? (idestado <> 1)
        $numero = Caja::query()
            ->where('idusuario', $usuarioId)
            ->where('idsucursal', $sucursalId)
            ->where('idestado', '<>', self::CAJA_CERRADA)
            ->max('numero') ?? 0;

        $existe = $numero > 0;

        if ($existe) {
            return Caja::query()
                ->where('idusuario', $usuarioId)
                ->where('idsucursal', $sucursalId)
                ->where('numero', $numero)
                ->first();
        }

        // No hay caja abierta: calcular el próximo número basado en las cerradas (idestado = 1)
        $maxCerrada = Caja::query()
            ->where('idusuario', $usuarioId)
            ->where('idsucursal', $sucursalId)
            ->where('idestado', )
            ->max('numero');

        $nuevoNumero = is_null($maxCerrada) ? 1 : ((int)$maxCerrada + 1);

        // cajainicial = importerendido de la caja previa (nuevoNumero - 1)
        $cajaPrevNumero = $nuevoNumero - 1;

        $cajainicial = DB::table('cajas')
            ->where('idsucursal', $sucursalId)
            ->where('idusuario', $usuarioId)
            ->where('numero', $cajaPrevNumero)
            ->value('importerendido');

        // Crear nueva caja abierta (idestado = 0)
        DB::table('cajas')->insert([
            'numero' => $nuevoNumero,
            'idusuario' => $usuarioId,
            'fechaapertura' => Carbon::now(),
            'fechacierre' => null,
            'idsucursal' => $sucursalId,
            'idestado' => self::CAJA_ABIERTA,
            'cajainicial' => $cajainicial,
        ]);

        return Caja::query()
            ->where('idusuario', $usuarioId)
            ->where('idsucursal', $sucursalId)
            ->where('numero', $nuevoNumero)
            ->first();
    }
}
