<?php

namespace App\Services\Compras;

use App\Models\Compra;
use App\Models\CompraDetalle;
use Illuminate\Support\Facades\DB;


class ComprasManager
{
    /*
     * Retorna query de compras que no son dudosas ni estan anuladas
     */
    public function getCompraDetallesLimpiasQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return CompraDetalle::query()
            ->select('comprasdetalle.*')
            ->join('compras', 'compras.id', '=', 'comprasdetalle.idcabecera')
            ->leftJoin('comprasanuladas', 'compras.id', '=', 'comprasanuladas.idcompra')
            ->leftJoin(db::raw('comprasanuladas as anulaciones'), 'compras.id', '=', 'anulaciones.idanulacion')
            ->leftJoin('comprasdudosas', 'comprasdetalle.id', '=', 'comprasdudosas.idcompradetalle')
            ->whereNull('comprasanuladas.idcompra')
            ->whereNull('anulaciones.idanulacion')
            ->where('comprasdetalle.cantidad', '>', 0)
            ->where(function ($query) {
                $query->whereNotIn('comprasdudosas.audicionresultado', [1, 3]);
                $query->orWhereNull('comprasdudosas.audicionresultado');
            })
            ->whereNull('comprasanuladas.idcompra');
    }

    public function getCompraDetallesARecalcularQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return CompraDetalle::query()
            ->select('comprasdetalle.*')
            ->join('compras', 'compras.id', '=', 'comprasdetalle.idcabecera')
            ->leftJoin('comprasanuladas', 'compras.id', '=', 'comprasanuladas.idcompra')
            ->leftJoin(db::raw('comprasanuladas as anulaciones'), 'compras.id', '=', 'anulaciones.idanulacion')
            ->leftJoin('comprasdudosas', 'comprasdetalle.id', '=', 'comprasdudosas.idcompradetalle')
            ->where(function ($query) {
                $query->whereNotNull('comprasanuladas.idcompra');
                $query->orWhereIn('comprasdudosas.audicionresultado', [1, 3]);
            });
    }
}
