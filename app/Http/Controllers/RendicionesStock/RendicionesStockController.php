<?php

namespace App\Http\Controllers\RendicionesStock;

use App\Http\Controllers\BaseController;
use App\Services\RendicionesStock\RendicionesStockManager;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Throwable;


class RendicionesStockController extends BaseController
{
    public function getGraficosSobrantesVsArreglos(Request $request){
        $fechaDesde = $request->input('fechaDesde') ? new Carbon($request->input('fechaDesde')) : Carbon::now();
        $semanas= $request->input('semanas') ?? 6;

        return app(RendicionesStockManager::class)->getArreglosVsSobrantes($fechaDesde, $semanas);
    }
    public function getGraficosSobrantesVsArreglosPorSucursal(Request $request){
        $fechaDesde = new Carbon($request->input('fechaDesde'));
        $fechaHasta = new Carbon($request->input('fechaHasta'));

        return app(RendicionesStockManager::class)
            ->getArreglosVsSobrantesPorSucursal($fechaDesde, $fechaHasta);
    }


    public function getGraficosSobrantesVsArreglosArticulosPorSucursal(Request $request){
        $fechaDesde = new Carbon($request->input('fechaDesde'));
        $fechaHasta = new Carbon($request->input('fechaHasta'));

        $sucursal = get_entity_or_fail('sucursal', $request->input('idsucursal'));

        return app(RendicionesStockManager::class)
            ->getArreglosVsSobrantesArticulosPorSucursal($fechaDesde, $fechaHasta, $sucursal);
    }

    public function getArreglosVsSobrantesArticuloPorSucursal(Request $request){
        $fechaDesde = new Carbon($request->input('fechaDesde'));
        $fechaHasta = new Carbon($request->input('fechaHasta'));

        $sucursal = get_entity_or_fail('sucursal', $request->input('idsucursal'));
        $articulo = get_entity_or_fail('Articulo', $request->input('idarticulo'));

        return app(RendicionesStockManager::class)
            ->getArreglosVsSobrantesArticuloPorSucursal($fechaDesde, $fechaHasta, $sucursal, $articulo);
    }

}
