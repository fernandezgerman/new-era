<?php

namespace App\Services\Gastos;

use App\Models\Gasto;
use App\Models\GastoDetalle;
use App\Models\LiquidacionPeriodoGasto;
use App\Models\Sucursal;
use App\Services\Actualizaciones\ActualizacionesManager;
use App\Services\Gastos\Enums\TiposGastos;
use App\Services\PeriodosContables\Exceptions\NoHayUnPeriodoContableAbiertoException;
use App\Services\PeriodosContables\PeriodosContablesManager;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class GastosManager
{
    private array $tiposGastos = [];
    public function __construct(
        private ActualizacionesManager $actualizacionesManager,
        private PeriodosContablesManager $periodosContablesManager
    )
    {
        $this->tiposGastos[TiposGastos::MERCADO_PAGO->value] = [
            "proveedorId" => config('medios_de_cobro.drivers.MercadoPagoQR.gastos.proveedorId'),
            "articuloId" => config('medios_de_cobro.drivers.MercadoPagoQR.gastos.articuloId'),
        ];
    }
    public function createGastoByTipo(
        int $usuarioId,
        int $sucursalId,
        float $totalGasto,
        string $observaciones,
        TiposGastos $tiposGasto,
        ?string $numero = null
    ): Gasto
    {

        $gasto = new Gasto();

        $gasto->fechaemision = Carbon::now()->format('Y-m-d H:i:s');
        $gasto->tipofactura = 'discrimina';
        $gasto->idusuario = $usuarioId;
        $gasto->idsucursal = $sucursalId;
        $gasto->totalfactura = $totalGasto;
        $gasto->idproveedor = Arr::get($this->tiposGastos, $tiposGasto->value.'.proveedorId') ;
        $gasto->numero = $numero ?? 'GST'.Carbon::now()->format('H:i:s');
        $gasto->fechahora = Carbon::now()->format('Y-m-d H:i:s');
        $gasto->numerocaja = null;
        $gasto->idusuariocaja = $usuarioId;
        $gasto->idsucursalcaja = $sucursalId;
        $gasto->mododepago = 1;
        $gasto->idestado = 1;
        $gasto->idtipocomprobante = 1;
        $gasto->observaciones = $observaciones;
        $gasto->fechacreacion = Carbon::now()->format('Y-m-d H:i:s');
        $gasto->idletra = null;
        $gasto->idunico = 'MPGST'.Carbon::now()->format('Y-m-d H:i:s');;
        $gasto->save();

        try{
            $periodo = $this->periodosContablesManager->obtenerPeriodoActual();

            LiquidacionPeriodoGasto::create([
                'idgasto' => $gasto->id,
                'idperiodo' => $periodo->id,
            ]);
        }catch(\Throwable $throwable){
            Log::warning('No hay un periodo contable abierto, no se registro el gasto en ningun periodo. (Se guardo correctamente)');
        }


        $gastoDetalle = new GastoDetalle();

        $gastoDetalle->idcabecera = $gasto->id;
        $gastoDetalle->idarticulo = Arr::get($this->tiposGastos, $tiposGasto->value.'.articuloId') ;
        $gastoDetalle->cantidad = 1;
        $gastoDetalle->precio = $totalGasto;
        $gastoDetalle->costoanterior = $totalGasto;

        $gastoDetalle->save();

        $this->actualizacionesManager->insertarActualizacion($gasto, $gasto->sucursal);

        return $gasto;
    }
}
