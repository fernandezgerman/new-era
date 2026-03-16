<?php

namespace App\Services\Cajas;

use App\Models\Caja;
use App\Models\Compra;
use App\Models\MovimientoCaja;
use App\Models\Pago;
use App\Models\Sucursal;
use App\Models\VentaSucursal;
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
    public function getCajaAbierta(int $usuarioId, int $sucursalId, bool $openIfClose = true): Caja
    {
        // ¿Existe alguna caja que no esté cerrada? (idestado <> 1)
        $numero = Caja::query()
            ->where('idusuario', $usuarioId)
            ->where('idsucursal', $sucursalId);

        if($openIfClose){
            $numero->where('idestado', '<>', self::CAJA_CERRADA);
        }

        $numero = $numero->max('numero') ?? 0;

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

    /**
     * Check the congruence of the calculated totals for a given Caja.
     */
    public function CheckCajaCongruence(Caja $caja): array
    {
        $messages = [];
        $offset = 10;

        // totalpagos: sum all "totalpago" from model "Pago" where pagos.idsucursalcaja = cajas.idsucursal, pagos.idusuariocaja = cajas and pagos.numerocaja = caja.numero
        $totalPagosCalc = Pago::where('idsucursalcaja', $caja->idsucursal)
            ->where('idusuariocaja', $caja->idusuario)
            ->where('numerocaja', $caja->numero)
            ->sum('totalpago');

        // totalcompras: sum all "totalfactura" from model "Compra" where compras.idsucursalcaja = cajas.idsucursal, compras.idusuariocaja = cajas.idusuario and compras.numerocaja = caja.numero
        $totalComprasCalc = Compra::where('idsucursalcaja', $caja->idsucursal)
            ->where('idusuariocaja', $caja->idusuario)
            ->where('numerocaja', $caja->numero)
            ->where('mododepago', 1)
            ->sum('totalfactura');

        // totalventas: sum all "preciounitario" * "cantidad" from model "VentaSucursal" where ventassucursal.idsucursal = cajas.idsucursal, ventassucursal.idusuario = cajas.idusuario and ventassucursal.numerocaja = caja.numero
        $totalVentasCalc = VentaSucursal::where('idsucursal', $caja->idsucursal)
            ->where('idusuario', $caja->idusuario)
            ->where('numerocaja', $caja->numero)
            ->sum(DB::raw('preciounitario * cantidad'));

        // totalmovimientos: substract (in negative) all out "importe" from model "MovimientoCaja" where movimientoscaja.idsucursal = cajas.idsucursal, movimientoscaja.idusuario = cajas.idusuario and movimientoscaja.numerocaja = caja.numero and idestado = 2.
        // Also, sum all in "importe" from model "MovimientoCaja" where movimientoscaja.idsucursaldestino = cajas.idsucursal, movimientoscaja.idusuariodestino = cajas.idusuario and movimientoscaja.numerocajadestino = caja.numero and idestado = 2
        $movimientosOut = MovimientoCaja::where('idsucursal', $caja->idsucursal)
            ->where('idusuario', $caja->idusuario)
            ->where('numerocaja', $caja->numero)
            ->where('idestado', 2)
            ->sum('importe');

        $movimientosIn = MovimientoCaja::where('idsucursaldestino', $caja->idsucursal)
            ->where('idusuariodestino', $caja->idusuario)
            ->where('numerocajadestino', $caja->numero)
            ->where('idestado', 2)
            ->sum('importe');

        $totalMovimientosCalc = $movimientosIn - $movimientosOut;

        $comparisons = [
            'totalpago' => ['calc' => $totalPagosCalc, 'caja' => $caja->totalpagos, 'label' => 'Total Pagos'],
            'totalcompras' => ['calc' => $totalComprasCalc, 'caja' => $caja->totalcompras, 'label' => 'Total Compras'],
            'totalventas' => ['calc' => $totalVentasCalc, 'caja' => $caja->totalventas, 'label' => 'Total Ventas'],
            'totalmovimientos' => ['calc' => $totalMovimientosCalc, 'caja' => $caja->totalmovimientos, 'label' => 'Total Movimientos'],
        ];

        foreach ($comparisons as $field => $data) {
            if (abs($data['calc'] - $data['caja']) > $offset) {
                $messages[] = sprintf(
                    "Error detected in %s for Caja (Nro: %s, Usuario: %s, Sucursal: %s). Total from caja: %s, Total calculated: %s.",
                    $data['label'],
                    $caja->numero,
                    $caja->idusuario,
                    $caja->idsucursal,
                    $data['caja'],
                    $data['calc']
                );
            }
        }

        return $messages;
    }
}
