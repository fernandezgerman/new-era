<?php

use App\Http\ApiResources\Dashboard;
use App\Http\Controllers\MediosDeCobro\MediosDeCobroController;
use App\Http\Middleware\CheckLegacyPermissions;
use App\Http\Middleware\ValidateMercadoPagoQR;
use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id} asdasfsda

route::prefix('movimientos-caja')->withoutMiddleware(['restrict.access.per.hour', 'auth:sanctum'])->group(function () {
    Route::post('/movimientos-pendientes-para-liq/{idsucursal}', [MovimientosCajaController::class, 'getMovimientosCajaPendientesParaLiq'])
        ->name('movimientos-caja.movimientos-pendientes-para-liq');

});

