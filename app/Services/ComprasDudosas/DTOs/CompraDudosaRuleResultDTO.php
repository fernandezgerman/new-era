<?php

namespace App\Services\ComprasDudosas\DTOs;

use App\Services\ComprasDudosas\Enums\TipoDeCompraDudosa;

class CompraDudosaRuleResultDTO
{
    public function __construct(
        public bool $pass,
        public TipoDeCompraDudosa $tipoDeCompraDudosa,
        public float $margenComparativo,
    ){

    }
}
