<?php

use App\Http\Controllers\Promociones\PromocionesController;
use Illuminate\Support\Facades\Route;

Route::prefix('promociones')->group(function () {
    Route::post('articulos', [PromocionesController::class, 'setPromocionArticulos']);
});
