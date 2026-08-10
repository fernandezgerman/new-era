<?php

namespace App\Providers;

use App\Services\OIDC\TokenResponseType as AppTokenResponseType;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Laravel\Passport\Passport;
use Admin9\OidcServer\Services\TokenResponseType as PackageTokenResponseType;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Reemplazamos la clase del paquete por la nuestra
        $this->app->bind(PackageTokenResponseType::class, AppTokenResponseType::class);
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

        if (app()->environment('production', 'staging')) {
            URL::forceHttps();           // Laravel 12 tiene forceHttps() nativo
            // URL::forceScheme('https'); // alternativa clásica
        }

        Passport::tokensCan([
            'openid'  => 'OpenID Connect',
            'profile' => 'Access to profile information',
            'email'   => 'Access to email address',
        ]);

        // Opcional pero recomendado
        Passport::setDefaultScope([
            'openid',
            'profile',
            'email',
        ]);


        Route::matched(function ($event) {
            if ($event->route?->uri() === 'oauth/authorize') {
                $event->route->middleware(\App\Http\Middleware\StoreOidcNonce::class);
            }
        });
    }
}
