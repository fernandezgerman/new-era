<?php

namespace App\Listeners\MediosDeCobro;

use App\DataAccessor\MedioDeCobroSucursalConfiguracionDataAccessor;
use App\Events\Events\MediosDeCobro\MediosDeCobroStatusChangeEvent;
use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Models\MovimientoCajaVentaSucursalCobro;
use App\Models\VentaSucursalCobro;
use App\Services\Gastos\Enums\TiposGastos;
use App\Services\Gastos\GastosManager;
use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;
use App\Services\MediosDeCobro\Enums\OrderPaymentChargeDetailTypeEnum;
use App\Services\MediosDeCobro\ModosDeCobroManager;
use App\Services\MovimientosDeCaja\Enums\MovimientoCajaEstados;
use App\Services\MovimientosDeCaja\MovimientosCajaManager;
use Illuminate\Support\Facades\Log;

class MediosDeCobroStatusChangeListener
{
    public function __construct(protected MovimientosCajaManager $movimientosCajaManager)
    {

    }
    /**
     * Handle the event.
     */
    public function handle(MediosDeCobroStatusChangeEvent $event): void
    {
        // Minimal, safe behavior: structured log for observability.
        $cobro = $event->ventaSucursalCobro;

        if($event->ventaSucursalCobro->estado === MedioDeCobroEstados::APROBADO || $event->ventaSucursalCobro->estado === MedioDeCobroEstados::APROBADO->value)
        {
            $medioDeCobroSucursalConfiguracionDataAccessor = new MedioDeCobroSucursalConfiguracionDataAccessor(
                $cobro->idsucursal,
                $cobro->idmododecobro
            );

            $configuracion = $medioDeCobroSucursalConfiguracionDataAccessor->getConfiguracionValidated();

            $existe = MovimientoCajaVentaSucursalCobro::query()
                ->where('idventasucursalcobro', $cobro->id)
                ->first();

            if(blank($existe))
            {
                $this->generarMovimientoDeCaja($cobro, $configuracion);
                $this->generarGastos($cobro, $configuracion);

            }
        }
    }

    private function generarGastos(VentaSucursalCobro $cobro, MedioDeCobroSucursalConfiguracion $configuracion): void
    {
        $manager = app(ModosDeCobroManager::class);
        $paymentDetails = $manager->processTaxesAndFees($cobro);

        $amount = 0.0;
        $observaciones = '';
        foreach($paymentDetails->chargeDetails as $chargeDetail)
        {
            if(!$chargeDetail->payedByCustomer)
            {
                if($observaciones !== '')
                {
                    $observaciones = $observaciones.PHP_EOL.PHP_EOL;
                }
                $observaciones = $observaciones.$chargeDetail->type->value === OrderPaymentChargeDetailTypeEnum::FEE->value ? 'CARGO POR ' : 'IMPUESTO POR ';
                $observaciones = $observaciones.$chargeDetail->name;
                if($chargeDetail->baseAmount > 0)
                {
                    $observaciones = $observaciones.PHP_EOL.' - $'.$chargeDetail->baseAmount.' x '.$chargeDetail->rate.'% = $'.$chargeDetail->amount;
                }else{
                    $observaciones = $observaciones.PHP_EOL.' - TOTAL: $'.$chargeDetail->amount;
                }
                $amount = $amount + $chargeDetail->amount;
            }
        }

        if($amount > 0)
        {
            app(GastosManager::class)->createGastoByTipo(
                $configuracion->idusuariocajadestino,
                $configuracion->idsucursalcajadestino,
                $amount,
                $observaciones,
                TiposGastos::MERCADO_PAGO,
                $paymentDetails->orderDTO->externalId ?? 'N/A'
            );
        }

    }
    private function generarMovimientoDeCaja(VentaSucursalCobro $cobro, MedioDeCobroSucursalConfiguracion $configuracion): void
    {
        $movimientoCaja = $this->movimientosCajaManager->createMovimientosCaja(
            $cobro->idsucursal,
            $cobro->idusuario,
            config('medios_de_cobro.drivers.MercadoPagoQR.id_motivo_movimiento_caja'),
            $cobro->importe,
            $configuracion->idsucursalcajadestino,
            $configuracion->idusuariocajadestino,
            'Movimiento automatico por venta con QR',
            null,
            MovimientoCajaEstados::APROBADO
        );

        $movimientoCajaVentaSucursalCobro = new MovimientoCajaVentaSucursalCobro();
        $movimientoCajaVentaSucursalCobro->idmovimientocaja = $movimientoCaja->id;
        $movimientoCajaVentaSucursalCobro->idventasucursalcobro = $cobro->id;
        $movimientoCajaVentaSucursalCobro->save();

    }
}
