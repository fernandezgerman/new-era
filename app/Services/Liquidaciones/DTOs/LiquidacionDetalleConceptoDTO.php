<?php

namespace App\Services\Liquidaciones\DTOs;

use App\Contracts\DTOInterface;
use App\Services\Liquidaciones\Collections\HistoricoValorizacionCollection;

class LiquidacionDetalleConceptoDTO implements DTOInterface
{
    public function __construct(
        public int $id,
        public string $descripcion,
        public HistoricoValorizacionCollection $detalles,
    ) {
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'descripcion' => $this->descripcion,
            'detalles' => $this->detalles->map(fn (HistoricoValorizacionDTO $dto) => $dto->toArray())->toArray(),
        ];
    }
}
