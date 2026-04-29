<?php

namespace App\Services\AsyncProcess;

use App\Services\AsyncProcess\Interfaces\AsyncProcessDTOInterface;
use App\Services\AsyncProcess\Jobs\DynamicServiceJob;

class AsyncProcessManager
{
    public static function handle(AsyncProcessDTOInterface $asyncProcessDTOInterface): void
    {

        DynamicServiceJob::dispatch($asyncProcessDTOInterface)
            ->onQueue('legacy')
            ->onConnection('database');
    }
}
