<?php

use App\Http\ApiResources\Dashboard;
use App\Http\Controllers\MediosDeCobro\MediosDeCobroController;
use App\Http\Middleware\CheckLegacyPermissions;
use App\Http\Middleware\ValidateMercadoPagoQR;
use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id} asdasfsda

route::prefix('caja')->group(function () {

    Route::get('sucursal/{idsucursal}/usuario/{idusuario}/ultima-caja', [\App\Http\Controllers\Cajas\CajaController::class, 'ultimaCaja'])
        ->name('caja.ultima-caja');

});


