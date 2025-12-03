<?php

namespace App\Listeners\MediosDeCobro;

use App\DataAccessor\MedioDeCobroSucursalConfiguracionDataAccessor;
use App\Events\Events\MediosDeCobro\MediosDeCobroStatusChangeEvent;
use App\Models\MovimientoCajaVentaSucursalCobro;
use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;
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
    }
}
