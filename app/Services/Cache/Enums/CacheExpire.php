<?php

namespace App\Services\Cache\Enums;

enum CacheExpire: string
{
    case MINUTE = '60';
    case TEN_MINUTES = '600';
    case HOUR = '3600';
    case NEXT_MONDAY  = 'next_monday';
}
