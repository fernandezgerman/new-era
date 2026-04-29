<?php

namespace App\Services\AsyncProcess\DTOs;

use App\Services\AsyncProcess\Enums\AvailableAsyncProcess;
use App\Services\AsyncProcess\Interfaces\AsyncProcessDTOInterface;

class AsyncProcessTestDTO implements AsyncProcessDTOInterface
{
    public function __construct(public string $mensaje = 'Mensaje test')
    {

    }
    public function toArray(): array
    {
        return [
            'mensaje' => $this->mensaje,
        ];
    }

    public function getAsyncProcessName(): AvailableAsyncProcess
    {
        return AvailableAsyncProcess::TEST;
    }
}
