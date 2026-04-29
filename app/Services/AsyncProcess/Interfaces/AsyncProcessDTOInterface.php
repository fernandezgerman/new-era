<?php

namespace App\Services\AsyncProcess\Interfaces;

use App\Services\AsyncProcess\Enums\AvailableAsyncProcess;

interface AsyncProcessDTOInterface
{
    public function getAsyncProcessName(): AvailableAsyncProcess;

    public function toArray(): array;
}
