<?php

namespace App\Services\Cache\CacheHandler;

use App\Services\Cache\CacheManager;
use App\Services\Cache\Enums\CacheExpire;

abstract class CacheHandler
{
    protected abstract function getExpireTime(): ?CacheExpire;
    protected abstract function getKey(): string;

    public function getValue(): mixed
    {
        return app(CacheManager::class)->getCacheValue($this->getKey());
    }

    public function setValue(mixed $value): void
    {
        app(CacheManager::class)->putCacheValue(
            $this->getKey(), $value, $this->getExpireTime()
        );
    }



}
