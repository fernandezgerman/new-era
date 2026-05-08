<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateIntegracionesArticulos
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-INTEGRACIONES-TOKEN') ?? $request->query('token');

        if (!$token || $token !== env('INTEGRACIONES_ARTICULOS_TOKEN')) {
            return response()->json([
                'message' => 'No autorizado. Token de integraciones inválido.',
            ], 401);
        }

        return $next($request);
    }
}
