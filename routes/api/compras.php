<?php

use App\Http\ApiResources\Dashboard;
use App\Http\Controllers\Compras\ComprasController;
use App\Http\Controllers\MediosDeCobro\MediosDeCobroController;
use App\Http\Middleware\CheckLegacyPermissions;
use App\Http\Middleware\ValidateMercadoPagoQR;
use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id} asdasfsda

route::prefix('compras')->withoutMiddleware('restrict.access.per.hour')->group(function () {

     Route::post('/{compraId}/procesar', [ComprasController::class, 'procesarCompra'])
        ->withoutMiddleware(['auth:sanctum', CheckLegacyPermissions::class])
        ->middleware('custom.auth')
        ->name('compras.process-legacy');

});


