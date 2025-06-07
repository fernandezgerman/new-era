<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureSucursalIsSelected
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
        // Check if user is authenticated
        if (Auth::check()) {
            // Check if a sucursal has been selected
            if (!session()->has('idSucursalActual') && $request->route()->getName() !== 'sucursal.selection' && $request->route()->getName() !== 'sucursal.select') {
                return redirect()->route('sucursal.selection');
            }
        }

        return $next($request);
    }
}
