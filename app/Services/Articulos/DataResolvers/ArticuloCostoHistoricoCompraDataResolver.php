<?php

namespace App\Services\Articulos\DataResolvers;

use App\Models\ArticuloCostoHistorico;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags\ArticuloCostoHistoricoTagsPorCompraDataResolver;


class ArticuloCostoHistoricoCompraDataResolver implements ArticuloCostoHistoricoDataResolver
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
            'descripcion' => 'Compra',
            'precio' => $articuloCostoHistorico?->compraDetalle?->precio ,
            'precioconimpuesto' => $articuloCostoHistorico?->compraDetalle?->costo_con_impuestos ,
            'tags' => app(ArticuloCostoHistoricoTagsPorCompraDataResolver::class)->resolve($articuloCostoHistorico),
            'links' => [
                [
                    'texto' => 'Compra #' . $articuloCostoHistorico?->compraDetalle?->compra->numero,
                    'url' => 'principal.php?withFrame=1&pagina=prmteditfaccmp&idCompra='.$articuloCostoHistorico?->compraDetalle?->compra->id
                ]
            ]
        ];
    }
}
