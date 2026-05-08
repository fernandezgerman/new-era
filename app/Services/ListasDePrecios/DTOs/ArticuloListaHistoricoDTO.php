<?php

namespace App\Services\ListasDePrecios\DTOs;

use App\Services\ListasDePrecios\Contracts\PrecioHistoricoDTOInterface;

class ArticuloListaHistoricoDTO implements PrecioHistoricoDTOInterface
{

    public function __construct(
        public int $idLista,
        public int $idArticulo,
        public ?float $precioExcepcion = null,
        public ?float $precioExcepcionListaBase = null,
        public ?bool $aplicaMinimoDeUtilidad = null
    )
    {
    }
}
