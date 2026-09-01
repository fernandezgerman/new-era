<?php

namespace App\Promociones\DTOs;

use App\Contracts\DTOInterface;

class ArticuloPromocionDTO implements DTOInterface
{
    public function __construct(
        public ?int $id = null,
        public int $promocion_id,
        public int $articulo_id,
        public float $porcentaje,
        public float $cantidad,
        public float $precio,
        public int $activo
    ) {
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'idpromocion' => $this->promocion_id,
            'idarticulo' => $this->articulo_id,
            'porcentaje' => $this->porcentaje,
            'cantidad' => $this->cantidad,
            'precio' => $this->precio,
            'activo' => $this->activo,
        ];
    }
}
