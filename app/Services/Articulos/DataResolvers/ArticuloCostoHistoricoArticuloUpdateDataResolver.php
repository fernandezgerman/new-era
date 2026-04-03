<?php

namespace App\Services\Articulos\DataResolvers;

use App\Models\ArticuloCostoHistorico;
use App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags\ArticuloCostoHistoricoTagsPorArticulosDataResolver;

class ArticuloCostoHistoricoArticuloUpdateDataResolver implements ArticuloCostoHistoricoDataResolver
{

    public function resolve(ArticuloCostoHistorico $articuloCostoHistorico): array
    {
        $links = null;
        if($articuloCostoHistorico?->compraDetalle?->compra){
            $links = [
                [
                    'texto' => 'Compra #' . $articuloCostoHistorico?->compraDetalle?->compra->numero,
                    'url' => 'principal.php?withFrame=1&pagina=prmteditfaccmp&idCompra='.$articuloCostoHistorico?->compraDetalle?->compra->id
                ]
            ];
        }

        return [
            'idarticulo' => $articuloCostoHistorico->idarticulo,
            'idcompradetalle' => $articuloCostoHistorico->idcompradetalle,
            'fechahora' => $articuloCostoHistorico->fechahora,
            'medio' => $articuloCostoHistorico->medio,
            'idusuario' => $articuloCostoHistorico->idusuario,
            'usuario' => $articuloCostoHistorico->usuario,
            'compradetalle' => $articuloCostoHistorico->compraDetalle,
            'descripcion' => 'Modificacion del costo desde articulos',
            'tags' => app(ArticuloCostoHistoricoTagsPorArticulosDataResolver::class)->resolve($articuloCostoHistorico),
            'precio' => $articuloCostoHistorico?->compraDetalle?->precio ?? $articuloCostoHistorico->precioauxiliar,
            'precioconimpuesto' => $articuloCostoHistorico?->compraDetalle?->costo_con_impuestos  ?? $articuloCostoHistorico->precioauxiliar,
            'links' => $links
        ];
    }
}
