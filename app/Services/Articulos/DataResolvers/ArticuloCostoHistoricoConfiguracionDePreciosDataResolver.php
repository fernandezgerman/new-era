<?php

namespace App\Services\Articulos\DataResolvers;

use App\Models\ArticuloCostoHistorico;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags\ArticuloCostoHistoricoTagsPorCompraDataResolver;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags\ArticuloCostoHistoricoTagsPorListaDePrecioDataResolver;

class ArticuloCostoHistoricoConfiguracionDePreciosDataResolver implements ArticuloCostoHistoricoDataResolver
{

    public function resolve(ArticuloCostoHistorico $articuloCostoHistorico): array
    {
        return [
            'idarticulo' => $articuloCostoHistorico->idarticulo,
            'idcompradetalle' => $articuloCostoHistorico->idcompradetalle,
            'fechahora' => $articuloCostoHistorico->fechahora,
            'medio' => $articuloCostoHistorico->medio,
            'idusuario' => $articuloCostoHistorico->idusuario,
            'precioauxiliar' => $articuloCostoHistorico->precioauxiliar,
            'usuario' => $articuloCostoHistorico->usuario,
            'compradetalle' => $articuloCostoHistorico->compraDetalle,
            'descripcion' => 'Establecido desde configuracion de precios',
            'precio' => $articuloCostoHistorico?->compraDetalle?->precio ,
            'precioconimpuesto' => $articuloCostoHistorico?->compraDetalle?->costo_con_impuestos ,
            'tags' => app(ArticuloCostoHistoricoTagsPorListaDePrecioDataResolver::class)->resolve($articuloCostoHistorico),
            'links' => [
                [
                    'texto' => 'Compra #' . $articuloCostoHistorico?->compraDetalle?->compra->numero,
                    'url' => 'principal.php?withFrame=1&pagina=prmteditfaccmp&idCompra='.$articuloCostoHistorico?->compraDetalle?->compra->id
                ]
            ]
        ];
    }
}
