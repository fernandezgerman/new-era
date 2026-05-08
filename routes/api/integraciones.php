<?php

use App\Http\Controllers\Integraciones\IntegracionesArticulosController;
use Illuminate\Support\Facades\Route;

Route::prefix('integraciones')->middleware('auth.integraciones')->group(function () {
    Route::get('articulo/{codigo}', [IntegracionesArticulosController::class, 'showByCodigo']);
    Route::get('articulo/buscar/{descripcion}', [IntegracionesArticulosController::class, 'searchByDescripcion']);
});
