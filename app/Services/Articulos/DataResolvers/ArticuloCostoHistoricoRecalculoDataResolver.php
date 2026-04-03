<?php

namespace App\Services\Articulos\DataResolvers;

use App\Models\ArticuloCostoHistorico;

class ArticuloCostoHistoricoRecalculoDataResolver implements ArticuloCostoHistoricoDataResolver
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
            'descripcion' => 'Anulacion o compra dudosa',
            'precio' => $articuloCostoHistorico?->compraDetalle?->precio,
            'precioconimpuesto' => $articuloCostoHistorico?->compraDetalle?->costo_con_impuestos,
            'links' => [
                [
                    'texto' => 'Compra #' . $articuloCostoHistorico?->compraDetalle?->compra->numero,
                    'url' => 'principal.php?withFrame=1&pagina=prmteditfaccmp&idCompra='.$articuloCostoHistorico?->compraDetalle?->compra->id
                ]
            ]
        ];
    }
}
