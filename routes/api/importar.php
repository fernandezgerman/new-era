<?php

use App\Http\Controllers\Importaciones\ImportacionListasController;
use App\Http\Controllers\Integraciones\IntegracionesArticulosController;
use App\Http\Middleware\CheckLegacyPermissions;
use Illuminate\Support\Facades\Route;

Route::prefix('importar')->group(function () {
    Route::prefix('listas')->group(function () {
        Route::post('/proveedor/{idproveedor}/file', [ImportacionListasController::class, 'importarPorArchivo']);
        Route::get('/pre-carga/{idcabecera}/detalles', [ImportacionListasController::class, 'getDetallesPreCarga']);
        Route::post('/pre-carga/{idcabecera}/definir-columnas', [ImportacionListasController::class, 'definirColumnas']);
        Route::get('/{idlista}/detalles', [ImportacionListasController::class, 'getDetallesLista']);
    });

});
