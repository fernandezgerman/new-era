<?php

namespace App\Services\AsyncProcess\DTOs\MercadoPago;

use App\Services\AsyncProcess\Enums\AvailableAsyncProcess;
use App\Services\AsyncProcess\Interfaces\AsyncProcessDTOInterface;

class AsyncProcessProcesarEventoDTO implements AsyncProcessDTOInterface
{
    public function __construct(public array $requestPayload, public string $className)
    {

    }
    public function toArray(): array
    {
        return [
            'payload' => $this->requestPayload,
            'className' => $this->className,
        ];
    }

    public function getAsyncProcessName(): AvailableAsyncProcess
    {
        return AvailableAsyncProcess::MERCARDO_PAGO_PROCESAR_EVENTO;
    }
}
