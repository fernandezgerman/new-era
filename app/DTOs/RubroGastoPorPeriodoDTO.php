<?php

namespace App\DTOs;

use Illuminate\Contracts\Support\Arrayable;

class RubroGastoPorPeriodoDTO implements Arrayable
{
    public function __construct(
        public int $id,
        public string $descripcion,
        public string $nombre,
        public float $importe,
        public ?string $sucursal = null,
        public ?int $periodoId = null,
        public ?int $sucursales_per_periodo = null,
        public ?int $total = null
    ) {}

    public function toArray(): array
    {
        return [
            'id'                     => $this->id,
            'descripcion'            => $this->descripcion,
            'nombre'                 => $this->nombre,
            'importe'                => $this->importe,
            'sucursal'               => $this->sucursal,
            'periodoId'              => $this->periodoId,
            'sucursales_per_periodo' => $this->sucursales_per_periodo,
            'total'                  => $this->total,
        ];
    }
}
