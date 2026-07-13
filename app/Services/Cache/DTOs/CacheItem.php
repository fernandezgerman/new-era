<?php

namespace App\Services\Cache\DTOs;

use App\Services\Cache\Enums\CacheExpire;

class CacheItem
{
    public function __construct(
        string $key,
        string $value,
        CacheExpire $timeToLive)
    {

    }
}
