<?php

namespace App\Http\Middleware;

use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQREventValidationFaild;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver;
use Closure;
use Illuminate\Http\Request;

class ValidateMercadoPagoQR
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     * @throws MercadoPagoQREventValidationFaild
     */
    public function handle( Request $request, Closure $next)
    {
        $driver = app(MercadoPagoQRDriver::class);

        //$driver->validateEventOrigin($request);


        return $next($request);
    }
}
