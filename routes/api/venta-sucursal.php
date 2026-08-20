<?php

use App\Http\ApiResources\Dashboard;
use App\Http\Controllers\MediosDeCobro\MediosDeCobroController;
use App\Http\Controllers\VentaSucursal\VentaSucursalController;
use App\Http\Middleware\CheckLegacyPermissions;
use App\Http\Middleware\ValidateMercadoPagoQR;
use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id} asdasfsda

route::prefix('venta-sucursal')->withoutMiddleware('restrict.access.per.hour')->group(function () {
    Route::post('/procesar-venta/{idventasucursal}', [VentaSucursalController::class, 'procesarVenta'])
        ->withoutMiddleware(['auth:sanctum', CheckLegacyPermissions::class])
        ->middleware('custom.auth')
        ->name('venta-sucursal.process-venta');
});


