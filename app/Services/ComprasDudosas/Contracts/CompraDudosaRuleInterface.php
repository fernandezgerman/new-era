<?php

namespace App\Services\ComprasDudosas\Contracts;

use App\Services\ComprasDudosas\DTOs\CompraDudosaDetalleDTO;
use App\Services\ComprasDudosas\DTOs\CompraDudosaRuleResultDTO;

interface CompraDudosaRuleInterface
{
    public function process(CompraDudosaDetalleDTO $compraDudosaDTO): CompraDudosaRuleResultDTO;
}
