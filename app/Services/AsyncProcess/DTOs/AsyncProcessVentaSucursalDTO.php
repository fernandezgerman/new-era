<?php

namespace App\Services\AsyncProcess\DTOs;

use App\Services\AsyncProcess\Enums\AvailableAsyncProcess;
use App\Services\AsyncProcess\Interfaces\AsyncProcessDTOInterface;
use App\Services\AsyncProcess\Traits\LoggeableJob;

class AsyncProcessVentaSucursalDTO implements AsyncProcessDTOInterface
{
    public function __construct(public int $ventaSucursalId)
    {

    }
    public function toArray(): array
    {
        return [
            'ventaSucursalId' => $this->ventaSucursalId,
        ];
    }

    public function getAsyncProcessName(): AvailableAsyncProcess
    {
        return AvailableAsyncProcess::PROCESAR_VENTA_SUCURSAL;
    }
}
