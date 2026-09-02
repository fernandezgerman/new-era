<?php

namespace App\Services\ComprasDudosas\Rules;

use App\Models\ListaDetalle;
use App\Services\ComprasDudosas\Contracts\CompraDudosaRuleInterface;
use App\Services\ComprasDudosas\DTOs\CompraDudosaDetalleDTO;
use App\Services\ComprasDudosas\DTOs\CompraDudosaRuleResultDTO;
use App\Services\ComprasDudosas\Enums\TipoDeCompraDudosa;
use App\Services\ComprasDudosas\Exceptions\PriceNotFoundException;
use Illuminate\Support\Carbon;

class CompraDudosaRuleBajoElCosto implements CompraDudosaRuleInterface
{

    /**
     * @throws PriceNotFoundException
     */
    public function process(CompraDudosaDetalleDTO $compraDudosaDTO): CompraDudosaRuleResultDTO
    {
        $configEntry = 'compras-dudosas.multiplos_de_comparacion.'. TipoDeCompraDudosa::COSTO_DISMINUYO_DEMASIADO->value;
        $multiplo = config($configEntry.'.base');

        $compra = $compraDudosaDTO->compraDetalle->compra;
        $compraComparacion = $compraDudosaDTO->compraDetalleComparable->compra;

        if($compra->idsucursal !== $compraComparacion->idsucursal)
        {
            $multiplo = $multiplo + (config($configEntry.'.variantes.diferente_sucursal') ?? 0);
        }

        if($compra->idproveedor !== $compraComparacion->idproveedor)
        {
            $multiplo = $multiplo + (config($configEntry.'.variantes.diferente_proveedor') ?? 0);
        }

/*        $compraFecha = new Carbon($compra->fechahora);
        $compraComparacionFecha = new Carbon($compraComparacion->fechahora);
        $diffEnDias = $compraComparacionFecha->diffInDays($compraFecha);

        $multiplo = $multiplo + ($diffEnDias * (config($configEntry.'.variantes.inflacion_por_dia') ?? 0));
*/
        $nuevoCosto = $compraDudosaDTO->compraDetalle->costo_con_impuestos;
        $viejoCosto = $compraDudosaDTO->compraDetalleComparable->costo_con_impuestos;

        // Si el viejo costo menos la variante admitida es menor al nuevo, pasa la prueba
        $pass = ($viejoCosto - $viejoCosto * $multiplo) < $nuevoCosto;

        return new CompraDudosaRuleResultDTO(
            $pass,
            TipoDeCompraDudosa::COSTO_DISMINUYO_DEMASIADO,
            $multiplo
        );
    }
}
