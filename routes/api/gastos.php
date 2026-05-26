<?php

use App\Http\Controllers\GastosController;
use App\Http\Middleware\CheckLegacyPermissions;
use Illuminate\Support\Facades\Route;

Route::prefix('gastos')
    //->withoutMiddleware(['auth:sanctum', 'restrict.access.per.hour', CheckLegacyPermissions::class])
    ->group(function () {
    Route::get('/reporte', [GastosController::class, 'reporte']);
    Route::get('/reporte/articulo/{idrubro}/agrupado', [GastosController::class, 'reporteArticulosPorRubroAgrupado']);
    Route::get('/periodo/{idperiodo}/contexto', [GastosController::class, 'getPeriodoContexto']);
    Route::get('/articulo/{idarticulo}/reporte', [GastosController::class, 'reporteArticulo']);
    Route::get('/detalle', [GastosController::class, 'detalle']);
    Route::patch('/{id}', [GastosController::class, 'update']);
});
