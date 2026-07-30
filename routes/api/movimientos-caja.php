<?php

use App\Http\Controllers\MovimientosCaja\MovimientosCajaController;
use Illuminate\Support\Facades\Route;

// GET /api/{entity}/{id} asdasfsda

route::prefix('movimientos-caja')->withoutMiddleware(['restrict.access.per.hour', 'auth:sanctum'])->group(function () {
    Route::post('/movimientos-pendientes-para-liq/{idsucursal}', [MovimientosCajaController::class, 'getMovimientosCajaPendientesParaLiq'])
        ->name('movimientos-caja.movimientos-pendientes-para-liq');

    Route::post('/reporte-mercado-pago', [MovimientosCajaController::class, 'getReporteMercadoPago'])
        ->name('movimientos-caja.reporte-mercado-pago');

});

