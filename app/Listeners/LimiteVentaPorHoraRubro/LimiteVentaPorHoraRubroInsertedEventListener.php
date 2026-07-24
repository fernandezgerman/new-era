<?php

namespace App\Listeners\LimiteVentaPorHoraRubro;

use App\DataAccessor\MedioDeCobroSucursalConfiguracionDataAccessor;
use App\Events\Events\LimiteVentaPorHoraRubro\LimiteVentaPorHoraRubroInsertedEvent;
use App\Events\Events\MediosDeCobro\MediosDeCobroStatusChangeEvent;
use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Models\MovimientoCajaVentaSucursalCobro;
use App\Models\VentaSucursalCobro;
use App\Services\Actualizaciones\ActualizacionesManager;
use App\Services\Actualizaciones\ServiceProviders\ActualizacionesServiceProvider;
use App\Services\Gastos\Enums\TiposGastos;
use App\Services\Gastos\GastosManager;
use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;
use App\Services\MediosDeCobro\Enums\MedioDeCobroTipos;
use App\Services\MediosDeCobro\Enums\OrderPaymentChargeDetailTypeEnum;
use App\Services\MediosDeCobro\ModosDeCobroManager;
use App\Services\MovimientosDeCaja\Enums\MovimientoCajaEstados;
use App\Services\MovimientosDeCaja\MovimientosCajaManager;
use App\Services\Ventas\VentasManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LimiteVentaPorHoraRubroInsertedEventListener
{
    public function __construct()
    {

    }

    /**
     * Handle the event.
     */
    public function handle(LimiteVentaPorHoraRubroInsertedEvent $event): void
    {
        Log::info('event listened for INSERTED');
        app(ActualizacionesManager::class)
            ->insertarActualizacion(
                $event->limiteVentaPorHoraRubro
            );
    }
}
