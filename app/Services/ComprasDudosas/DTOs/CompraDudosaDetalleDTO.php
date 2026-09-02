<?php

namespace App\Services\ComprasDudosas\DTOs;

use App\Models\CompraDetalle;

class CompraDudosaDetalleDTO
{
    public function __construct(
        public CompraDetalle $compraDetalle,
        public CompraDetalle $compraDetalleComparable
    ){

    }
}
