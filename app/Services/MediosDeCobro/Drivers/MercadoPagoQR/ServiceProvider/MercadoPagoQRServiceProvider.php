<?php
namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\ServiceProvider;

use Illuminate\Support\ServiceProvider;
class MercadoPagoQRServiceProvider  extends ServiceProvider
{

    public function provides()
    {
        return [

        ];
    }

    public function register()
    {
        if ($this->exchangeDriverConfig['implements_hedging'])
        {
            $this->commands([
                GetOfflineCotizationsCommand::class,
                HedgeComponentsCommand::class,
            ]);

            $this->app->bind(\App\Services\CurrencyManager\Contracts\HedgingDriver::class, $this->exchangeDriverConfig['implementation']);
        }

        $this->app->bind(CurrencyExchange::class, $this->exchangeDriverConfig['implementation']);
    }
}
