<?php

namespace App\Services\AsyncProcess\DTOs;

use App\Services\AsyncProcess\Enums\AvailableAsyncProcess;
use App\Services\AsyncProcess\Interfaces\AsyncProcessDTOInterface;
use App\Services\AsyncProcess\Traits\LoggeableJob;

class AsyncProcessActualizarReferenciasCostosDTO implements AsyncProcessDTOInterface
{
    public function __construct(public int $compraId)
    {

    }
    public function toArray(): array
    {
        return [
            'compraId' => $this->compraId,
        ];
    }

    public function getAsyncProcessName(): AvailableAsyncProcess
    {
        return AvailableAsyncProcess::ACTUALIZAR_REFERENCIAS_COSTOS;
    }
}
