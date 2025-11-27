<?php
namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\ServiceProvider;

use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Observers\MedioDeCobroSucursalConfiguracionObserver;
use Illuminate\Support\ServiceProvider;
class MercadoPagoQRServiceProvider  extends ServiceProvider
{

    public function register()
    {

    }

    public function boot()
    {
        $this->bootObservers();
    }
    private function bootObservers(): void
    {
        MedioDeCobroSucursalConfiguracion::observe(MedioDeCobroSucursalConfiguracionObserver::class);
    }
}
