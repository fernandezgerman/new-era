<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Load extra migrations from MediosDeCobro service so they run with `php artisan migrate`
        $path = app_path('Services/MediosDeCobro/Drivers/MercadoPagoQR/Database');
        if (is_dir($path)) {
            $this->loadMigrationsFrom($path);
        }
    }
}
