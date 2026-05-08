<?php

namespace App\Services\Articulos\DataResolvers\ArticuloPrecioHistorico;

use App\Models\ArticuloCostoHistorico;
use App\Models\ArticuloPrecioHistorico;
use App\Models\PrecioHistorico;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoDataResolver;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags\ArticuloCostoHistoricoTagsPorCompraDataResolver;
use App\Services\Articulos\Enums\ArticulosPreciosHistoricoTipos;
use Exception;
use Illuminate\Support\Collection;


class ArticuloPrecioHistoricoCabeceraDataResolver
{

    public function resolve(PrecioHistorico $precioHistorico, Collection $articulosPrecioHistoricos): array
    {
        return [
            'id' => $precioHistorico->id,
            'usuario' => $precioHistorico->usuario,
            'fecha' => $precioHistorico->created_at,
            'detalles' => $articulosPrecioHistoricos->map(fn(ArticuloPrecioHistorico $articuloPrecioHistorico) =>match($articuloPrecioHistorico->tipo) {
                ArticulosPreciosHistoricoTipos::LISTA_PRINCIPAL->value => app(ArticuloPrecioHistoricoListaPrincipalDataResolver::class)->resolve($articuloPrecioHistorico),
                ArticulosPreciosHistoricoTipos::LISTA_DEPENDIENTE->value => app(ArticuloPrecioHistoricoListaDependienteDataResolver::class)->resolve($articuloPrecioHistorico),
                ArticulosPreciosHistoricoTipos::PRECIO_TEMPORAL->value => app(ArticuloPrecioHistoricoPrecioTemporalDataResolver::class)->resolve($articuloPrecioHistorico),
                ArticulosPreciosHistoricoTipos::PROMOCION->value => app(ArticuloPrecioHistoricoPrecioPromocionDataResolver::class)->resolve($articuloPrecioHistorico),
                default => throw new Exception('No se encontro el resolver de para el historico de precios')
                }),
        ];
    }
}
