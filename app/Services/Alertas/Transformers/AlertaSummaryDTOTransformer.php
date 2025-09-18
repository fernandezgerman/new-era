<?php

namespace App\Services\Alertas\Transformers;

use App\Contracts\Transformer;
use App\Services\Alertas\DTOs\AlertaSummaryDTO;

class AlertaSummaryDTOTransformer implements Transformer
{
    public function transform(AlertaSummaryDTO $dto)
    {
        return [
            'cantidad' => (int)$dto->cantidad,
            'amarillo' => (int)$dto->amarillo,
            'azul' => (int)$dto->azul,
            'bloqueante' => null,
            'codigo' => $dto->alertaTipo?->codigo ?? '',
            'id' => (int)($dto->alertaTipo?->id ?? 0),
            'use_api_resource' => ($dto->alertaTipo?->id === config('alertas.solicitud_de_pago_alerta_id')),
            'negro' => (int)$dto->negro,
            'nombre' => $dto->alertaTipo?->nombre ?? '',
            'rojo' => (int)$dto->rojo,
            'verde' => (int)$dto->verde,
            'violeta' => (int)$dto->violeta,
        ];
    }
}
