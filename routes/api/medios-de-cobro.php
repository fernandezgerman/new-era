<?php

use App\Http\ApiResources\Dashboard;
use App\Http\Controllers\MediosDeCobro\MediosDeCobroController;
use App\Http\Middleware\CheckLegacyPermissions;
use App\Http\Middleware\ValidateMercadoPagoQR;
use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id} asdasfsda

route::prefix('medios-de-cobro')->group(function () {
    route::prefix('mercado-pago-qr')
        ->withoutMiddleware(['auth:sanctum', CheckLegacyPermissions::class])
        ->middleware(ValidateMercadoPagoQR::class)
        ->group(function () {
            Route::post('event/{validationToken}', [MediosDeCobroController::class, 'processEvent']);
        });

    Route::post('/order/generate', [MediosDeCobroController::class, 'generateOrderByData'])
        ->withoutMiddleware(['auth:sanctum', CheckLegacyPermissions::class])
        ->middleware('custom.auth')
        ->name('medios-de-cobro.order-legacy-generate');

    Route::post('/test-connection', [MediosDeCobroController::class, 'testQRConnection'])
        ->name('medios-de-cobro.test-connection');
});


