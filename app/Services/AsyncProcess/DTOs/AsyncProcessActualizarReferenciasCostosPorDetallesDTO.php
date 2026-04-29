<?php

namespace App\Services\AsyncProcess\DTOs;

use App\Services\AsyncProcess\Enums\AvailableAsyncProcess;
use App\Services\AsyncProcess\Interfaces\AsyncProcessDTOInterface;
use Illuminate\Support\Collection;

class AsyncProcessActualizarReferenciasCostosPorDetallesDTO implements AsyncProcessDTOInterface
{
    public function __construct(public Collection $compraDetalles)
    {

    }
    public function toArray(): array
    {
        return [$this->compraDetalles->toArray()];
    }

    public function getAsyncProcessName(): AvailableAsyncProcess
    {
        return AvailableAsyncProcess::ACTUALIZAR_REFERENCIAS_COSTOS_POR_DETALLES;
    }
}
