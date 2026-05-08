<?php

namespace App\Services\ListasDePrecios\DTOs;

use App\Services\ListasDePrecios\Contracts\PrecioHistoricoDTOInterface;
use Illuminate\Support\Carbon;

class PrecioTemporalHistoricoDTO implements PrecioHistoricoDTOInterface
{

    public function __construct(
        public int $idArticulo,
        public float $precio,
        public ?int $id,
        public ?Carbon $fecha = null,
        public ?int $cantidad = null,
        public ?int $idLista = null,
        public ?int $idSucursal = null,
        public ?int $activo = null,
    )
    {
    }
}
