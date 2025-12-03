<?php

namespace App\Services\Actualizaciones\ServiceProviders;

use Illuminate\Support\ServiceProvider;

class ActualizacionesServiceProvider extends ServiceProvider
{
    public function provides()
    {
        return [\App\Services\Actualizaciones\Contracts\ActualizacionesDriverInterface::class];
    }

    /**
     * Bootstrap any application services.
     */
    public function register(): void
    {
        $this->app->bind(\App\Services\Actualizaciones\Contracts\ActualizacionesDriverInterface::class, \App\Services\Actualizaciones\Drivers\Legacy\ActualizacionesLegacyDriver::class);
    }
}
