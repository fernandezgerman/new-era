<?php

namespace App\Http\Middleware;

use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQREventValidationFaild;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

        if(request()->route('validationToken') !== env('MERCADO_PAGO_URL_VALIDATION_TOKEN'))
        {
            Log::warning('MercadoPagoQR request validation token is invalid.');
            return response()->json([
                'message' => 'User not found',
            ], 403);
        }

        return $next($request);
    }
}
