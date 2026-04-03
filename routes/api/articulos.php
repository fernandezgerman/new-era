<?php

use Illuminate\Support\Facades\Route;

// GET /api/{entity}/{id} asdasfsda

route::prefix('articulos')->group(function () {

    Route::get('{idarticulo}/historico-costos', [\App\Http\Controllers\Articulos\ArticulosController::class, 'articulosHistoricoDeCostos'])
        ->name('articulo.historico-costos');

});


