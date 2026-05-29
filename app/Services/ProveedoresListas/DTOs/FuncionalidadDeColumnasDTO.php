<?php

namespace App\Services\ProveedoresListas\DTOs;

class FuncionalidadDeColumnasDTO
{
    public function __construct(
        public ?string $precio = null,
        public ?string $descripcion = null,
        public ?string $codigo1 = null,
        public ?string $codigo2 = null,
        public ?string $codigo3 = null,
        public ?string $codigosConComa = null,

    ) {
    }

    public function toArray(): array
    {
        return [
            'precio' => $this->precio,
            'descripcion' => $this->descripcion,
            'codigo1' => $this->codigo1,
            'codigo2' => $this->codigo2,
            'codigo3' => $this->codigo3,
            'codigos_con_coma' => $this->codigosConComa
        ];
    }
}
