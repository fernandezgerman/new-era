<?php

use App\Http\Controllers\Integraciones\IntegracionesArticulosController;
use App\Http\Middleware\CheckLegacyPermissions;
use Illuminate\Support\Facades\Route;

Route::prefix('integraciones')->middleware('auth.integraciones')
    ->withoutMiddleware(['auth:sanctum', 'restrict.access.per.hour', CheckLegacyPermissions::class])
    ->group(function () {
    Route::get('articulo/{codigo}', [IntegracionesArticulosController::class, 'showByCodigo']);
    Route::get('articulo/buscar/{descripcion}', [IntegracionesArticulosController::class, 'searchByDescripcion']);
});
