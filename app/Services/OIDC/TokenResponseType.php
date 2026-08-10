<?php

namespace App\Services\OIDC;

use Admin9\OidcServer\Services\TokenResponseType as BaseTokenResponseType;
use App\Services\Cache\CacheManager;
use App\Services\Cache\Enums\CacheExpire;
use Complex\Exception;

class TokenResponseType extends BaseTokenResponseType
{
    protected function resolveNonce(): ?string
    {
        // 1. Intentamos leer el nonce guardado en sesión (authorize)
        $nonce = app(CacheManager::class)->getCacheValue('oidc_nonce');

        // 2. Fallback por si viene en el request (casi nunca en /token)
        if (!$nonce) {
            $nonce = request()->input('nonce');
        }

        return $nonce;
    }
}
