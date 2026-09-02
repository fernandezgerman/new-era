<?php

namespace App\Services\ComprasDudosas\Rules;

use App\Models\ListaDetalle;
use App\Services\ComprasDudosas\Contracts\CompraDudosaRuleInterface;
use App\Services\ComprasDudosas\DTOs\CompraDudosaDetalleDTO;
use App\Services\ComprasDudosas\DTOs\CompraDudosaRuleResultDTO;
use App\Services\ComprasDudosas\Enums\TipoDeCompraDudosa;
use App\Services\ComprasDudosas\Exceptions\PriceNotFoundException;

class CompraDudosaRuleCostoMayorAlPrecio implements CompraDudosaRuleInterface
{

    /**
     * @throws PriceNotFoundException
     */
    public function process(CompraDudosaDetalleDTO $compraDudosaDTO): CompraDudosaRuleResultDTO
    {
        $listaDetalle = ListaDetalle::where('idarticulo', $compraDudosaDTO->compraDetalle->idarticulo)
            ->where('idlista', config('compras-dudosas.lista_precio_comparable_id'))
            ->first();

        if (is_null($listaDetalle)) {
            throw new PriceNotFoundException('no hay un precio de venta para el articulo '.$compraDudosaDTO->compraDetalle->idarticulo);
        }

        return new CompraDudosaRuleResultDTO(
            $compraDudosaDTO->compraDetalle->costo_con_impuestos <= $listaDetalle->precio,
            TipoDeCompraDudosa::COSTO_MAS_ALTO_QUE_PRECIO,
            0
        );
    }
}
