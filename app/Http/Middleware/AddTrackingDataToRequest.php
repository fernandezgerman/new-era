<?php

namespace App\Http\Middleware;

use App\Support\Helpers\UniversalUniqueIdentifierHelper;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddTrackingDataToRequest
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

        $request->attributes->add(
            [
                'traking_data' => [
                    'url' => $request->url(),
                    'user' => auth()->user()->id ?? null,
                ]
            ]);

        return $next($request);
    }
}
