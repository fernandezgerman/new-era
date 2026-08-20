<?php

namespace App\Services\Cache;

use App\Services\Cache\Enums\CacheExpire;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Closure;

class CacheManager
{

    /**
     * @param array $params
     * @param CacheExpire $expire
     * @param Closure $functionWithTheValues
     * @return string
     */
    public function Cache($key, CacheExpire $expire, Closure $functionWithTheValues)
    {
        return Cache::remember(
            is_array($key) ? serialize($key) : $key, $this->getExireTime($expire), $functionWithTheValues);
    }

    protected function getExireTime(CacheExpire $expire): int|Carbon
    {
        return match ($expire) {
            CacheExpire::NEXT_MONDAY => Carbon::now()->next(Carbon::MONDAY)->setTime(9, 0, 0),
            default => (int) $expire->value,
        };
    }

    public function getCacheValue($key): mixed
    {
        return Cache::get(is_array($key) ? serialize($key) : $key);
    }

    public function putCacheValue(string $key, mixed $value, ?CacheExpire $expire): void
    {
        Cache::put($key, $value, $expire ? $this->getExireTime($expire) : null);
    }

    public function clearCache($key): mixed
    {
        return Cache::forget(is_array($key) ? serialize($key) :$key);
    }

}
