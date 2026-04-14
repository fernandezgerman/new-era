<?php

namespace App\Services\Cache;

use App\Services\Cache\Enums\CacheExpire;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Closure;

class CacheManager
{

    public function Cache(array $params, CacheExpire $expire, Closure $functionWithTheValues)
    {
        return Cache::store('redis')->remember(
            serialize($params), $this->getExireTime($expire), $functionWithTheValues);
    }

    protected function getExireTime(CacheExpire $expire): int|Carbon
    {
        return match ($expire) {
            CacheExpire::NEXT_MONDAY => Carbon::now()->next(Carbon::MONDAY)->setTime(9, 0, 0),
            default => (int) $expire->value,
        };
    }
}
