<?php

namespace App\Http\Middleware;

use App\Http\Exceptions\Api\Exceptions\ApiUnauthorizedException;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

class CheckLegacyPermissions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $permisos = session("permisos");
        $pagina = $request->get("pagina");
        // Check if user is authenticated
        if ($permisos && $pagina) {
            if(Arr::get($permisos,$pagina) === 'RESTRINGIDO')
            {
                throw new ApiUnauthorizedException('Acceso Restringido ');
            }
        }

        return $next($request);
    }
}
