<?php

use App\Http\ApiResources\Dashboard;
use App\Http\Controllers\MediosDeCobro\MediosDeCobroController;
use App\Http\Middleware\CheckLegacyPermissions;
use App\Http\Middleware\ValidateMercadoPagoQR;
use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id} asdasfsda

route::prefix('rendiciones-stock')->group(function () {

    Route::get('sobrantes-vs-arreglos', [\App\Http\Controllers\RendicionesStock\RendicionesStockController::class, 'getGraficosSobrantesVsArreglos'])
        ->name('rendiciones-stock.get-graficos-sobranes-vs-arreglos');

    Route::post('sobrantes-vs-arreglos/por-sucursal', [\App\Http\Controllers\RendicionesStock\RendicionesStockController::class, 'getGraficosSobrantesVsArreglosPorSucursal'])
        ->name('rendiciones-stock.graficos-sobranes-vs-arreglos.por-sucursal');

    Route::post('sobrantes-vs-arreglos/por-articulos', [\App\Http\Controllers\RendicionesStock\RendicionesStockController::class, 'getGraficosSobrantesVsArreglosArticulosPorSucursal'])
        ->name('rendiciones-stock.graficos-sobranes-vs-arreglos.por-articulos-sucursal');


    Route::post('sobrantes-vs-arreglos/por-articulo', [\App\Http\Controllers\RendicionesStock\RendicionesStockController::class, 'getArreglosVsSobrantesArticuloPorSucursal'])
        ->name('rendiciones-stock.graficos-sobranes-vs-arreglos.por-articulo-sucursal');


});


