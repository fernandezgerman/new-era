<?php

use App\Http\ApiResources\Dashboard;
use App\Http\Controllers\MediosDeCobro\MediosDeCobroController;
use App\Http\Controllers\RendicionesStock\RendicionesStockController;
use App\Http\Middleware\CheckLegacyPermissions;
use App\Http\Middleware\ValidateMercadoPagoQR;
use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id} asdasfsda

route::prefix('rendiciones-stock')->group(function () {

    Route::post('/', [RendicionesStockController::class, 'create'])
        ->name('rendiciones-stock.create');

    Route::get('/list-today', [RendicionesStockController::class, 'listToday'])
        ->name('rendiciones-stock.list-today');

    Route::get('/{rendicionId}/articulos-pendientes', [RendicionesStockController::class, 'rendicionArticulosPendientes'])
        ->name('rendicion.articulos-pendientes');

    Route::get('/{rendicionId}/articulos-rendidos', [RendicionesStockController::class, 'rendicionArticulosRendidos'])
        ->name('rendicion.articulos-rendidos');

    Route::post('/{rendicionId}/rendir', [RendicionesStockController::class, 'rendirArticulo'])
        ->name('rendicion.rendir');

});


