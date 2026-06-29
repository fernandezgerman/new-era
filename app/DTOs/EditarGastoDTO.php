<?php

namespace App\DTOs;

use Illuminate\Support\Carbon;

readonly class EditarGastoDTO
{
    public function __construct(
        public int     $idCompra,
        public int     $idCompraDetalle,
        public int     $idarticulo,
        public int     $idperiodo,
        public int     $idsucursal,
        public float   $importe,
        public Carbon  $fechaEmision,
        public int     $idProveedor,
        public ?string $observaciones = null,
        public ?int    $idperiodoAnterior = null,
    ) {
    }
}
