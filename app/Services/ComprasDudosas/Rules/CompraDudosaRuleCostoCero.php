<?php

namespace App\Services\ComprasDudosas\Rules;

use App\Models\ListaDetalle;
use App\Services\ComprasDudosas\Contracts\CompraDudosaRuleInterface;
use App\Services\ComprasDudosas\DTOs\CompraDudosaDetalleDTO;
use App\Services\ComprasDudosas\DTOs\CompraDudosaRuleResultDTO;
use App\Services\ComprasDudosas\Enums\TipoDeCompraDudosa;
use App\Services\ComprasDudosas\Exceptions\PriceNotFoundException;

class CompraDudosaRuleCostoCero implements CompraDudosaRuleInterface
{

    /**
     * @throws PriceNotFoundException
     */
    public function process(CompraDudosaDetalleDTO $compraDudosaDTO): CompraDudosaRuleResultDTO
    {

        return new CompraDudosaRuleResultDTO(
            ($compraDudosaDTO->compraDetalle->precio > 0),
            TipoDeCompraDudosa::COSTO_CERO,
            0
        );
    }
}
