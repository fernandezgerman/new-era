<?php

namespace App\Services\Liquidaciones\DTOs;

use App\Contracts\DTOInterface;

class HistoricoValorizacionDTO implements DTOInterface
{
    public function __construct(
        public ?string $fecha = null,
        public ?string $descripcion = null,
        public ?float $importe = null,
    ) {
    }

    public function toArray(): array
    {
        return [
            'fecha' => $this->fecha,
            'descripcion' => $this->descripcion,
            'importe' => $this->importe,
        ];
    }
}
