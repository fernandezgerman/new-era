<?php

namespace App\Services\Articulos\DataResolvers\ArticuloCostoHistoricoTags;

use App\Models\ArticuloCostoHistorico;
use App\Models\CompraDudosa;

class ArticuloCostoHistoricoTagsPorCompraDataResolver implements ArticuloCostoHistoricoTagsInterface
{

    public function resolve(ArticuloCostoHistorico $articuloCostoHistorico): array
    {
        if(blank($articuloCostoHistorico?->compraDetalle)){
            return [];
        }

        $usuarioCompra = $articuloCostoHistorico?->compraDetalle?->compra->usuario->nombre_completo ?? '';
        $proveedorCompra = $articuloCostoHistorico?->compraDetalle?->compra->proveedor->nombre?? '';
        $sucursalCompra = $articuloCostoHistorico?->compraDetalle?->compra->sucursal->nombre?? '';
        $anulada = $articuloCostoHistorico?->compraDetalle?->compra->anulacion;

        $duda = CompraDudosa::where('idcompradetalle', $articuloCostoHistorico?->compraDetalle->id)->first();

        $anulada = blank($anulada) ? null :
            [
                'usuario' => $anulada->usuarioAnulo,
                'fechacreacion' => $anulada->fechacreacion,
            ];

        $duda = blank($duda) ? null :
            [
                'resultado' => $duda->audicion_descripcion,
                'audicionresultado' => (int)$duda->audicionresultado,
                'usuario' => $duda->usuarioAudito,
            ];

        return array_filter([
            'proveedor' => $proveedorCompra,
            'sucursal' => $sucursalCompra,
            'usuario' => $usuarioCompra,
            'anulada' => $anulada,
            'dudosa' => $duda,
        ]);
    }
}

