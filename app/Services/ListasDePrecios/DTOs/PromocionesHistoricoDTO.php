<?php

namespace App\Services\ListasDePrecios\DTOs;

use App\Services\ListasDePrecios\Contracts\PrecioHistoricoDTOInterface;
use Illuminate\Support\Carbon;

class PromocionesHistoricoDTO implements PrecioHistoricoDTOInterface
{

    public function __construct(
        public int $idArticulo,
        public float $precio,
        public int $idPromocion,
        public ?int $id = null,
        public ?float $porcentaje = null,
        public ?float $cantidad = null,
        public ?int $activo = null,
    )
    {
    }
}
