<?php

namespace App\DTOs;

use Illuminate\Contracts\Support\Arrayable;

class GastoDTO implements Arrayable
{
    public function __construct(
        public int $id,
        public string $fecha,
        public string $comprobante,
        public float $importe,
        public string $sucursal,
        public string $articulo,
        public ?string $observaciones = null
    ) {}

    public function toArray(): array
    {
        return [
            'id'            => $this->id,
            'fecha'         => $this->fecha,
            'comprobante'   => $this->comprobante,
            'importe'       => $this->importe,
            'sucursal'      => $this->sucursal,
            'articulo'      => $this->articulo,
            'observaciones' => $this->observaciones,
        ];
    }
}
