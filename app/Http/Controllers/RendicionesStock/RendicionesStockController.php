<?php

namespace App\Http\Controllers\RendicionesStock;

use App\Http\Controllers\BaseController;
use App\Services\Auditoria\Traits\Audicionable;
use App\Services\RendicionesStock\RendicionesStockManager;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Throwable;


class RendicionesStockController extends BaseController
{
    use Audicionable;
    public function getGraficosSobrantesVsArreglos(Request $request){
        $fechaDesde = $request->input('fechaDesde') ? new Carbon($request->input('fechaDesde')) : Carbon::now();
        $semanas= $request->input('semanas') ?? 6;

        $this->auditar(
            'VerArreglosDeStock',
            'Grafico De Arreglos Vs Sobrantes',
        '0',
        [
            "desde" => $fechaDesde,
            "semanas" => $semanas,
        ]);

        return app(RendicionesStockManager::class)->getArreglosVsSobrantes($fechaDesde, $semanas);
    }
    public function getGraficosSobrantesVsArreglosPorSucursal(Request $request){
        $fechaDesde = new Carbon($request->input('fechaDesde'));
        $fechaHasta = new Carbon($request->input('fechaHasta'));

        $this->auditar(
            'VerArreglosDeStock',
            'Grafico De Arreglo Por Sucursal',
            '0',
            [
                "desde" => $fechaDesde,
                "hasta" => $fechaHasta,
            ]);

        return app(RendicionesStockManager::class)
            ->getArreglosVsSobrantesPorSucursal($fechaDesde, $fechaHasta);
    }


    public function getGraficosSobrantesVsArreglosArticulosPorSucursal(Request $request){
        $fechaDesde = new Carbon($request->input('fechaDesde'));
        $fechaHasta = new Carbon($request->input('fechaHasta'));

        $sucursal = get_entity_or_fail('sucursal', $request->input('idsucursal'));

        $this->auditar(
            'ArreglosDeStockPorArticulos',
            'Grafico de arreglos por articulo',
            '0',
            [
                "desde" => $fechaDesde,
                "hasta" => $fechaHasta,
                "sucursalNombre" => $sucursal->nombre,
                "sucursalId" => $sucursal->id
            ]);

        return app(RendicionesStockManager::class)
            ->getArreglosVsSobrantesArticulosPorSucursal($fechaDesde, $fechaHasta, $sucursal);
    }

    public function getArreglosVsSobrantesArticuloPorSucursal(Request $request){
        $fechaDesde = new Carbon($request->input('fechaDesde'));
        $fechaHasta = new Carbon($request->input('fechaHasta'));

        $sucursal = get_entity_or_fail('sucursal', $request->input('idsucursal'));
        $articulo = get_entity_or_fail('Articulo', $request->input('idarticulo'));

        $this->auditar(
            'ArreglosDeStockGrafico',
            'Grafico de arreglos para articulo puntual',
            '0',
            [
                "desde" => $fechaDesde,
                "hasta" => $fechaHasta,
                "sucursalNombre" => $sucursal->nombre,
                "sucursalId" => $sucursal->id,
                "articuloNombre" => $articulo->nombre,
                "articuloId" => $articulo->id
            ]);

        return app(RendicionesStockManager::class)
            ->getArreglosVsSobrantesArticuloPorSucursal($fechaDesde, $fechaHasta, $sucursal, $articulo);
    }

}
