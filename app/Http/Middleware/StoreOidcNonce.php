<?php

namespace App\Http\Middleware;

use App\Services\Cache\CacheManager;
use App\Services\Cache\Enums\CacheExpire;
use Closure;
use Illuminate\Http\Request;

class StoreOidcNonce
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->has('nonce')) {
            app(CacheManager::class)->putCacheValue('oidc_nonce',$request->input('nonce'),  CacheExpire::TEN_MINUTES);
        }

        return $next($request);
    }
}
