<?php

use App\Http\ApiResources\Dashboard;
use Illuminate\Support\Facades\Route;

route::prefix('alerta')->group(function () {

    /* ALERTAS  */
    Route::get('', [Dashboard::class, 'getAlertas']);
    Route::get('{alertaId}/detalles', [Dashboard::class, 'getAlertaDetalles']);
    Route::post('alerta-tipo/{alertaTipoId}/marcar-como-leidas', [Dashboard::class, 'MarcarAlertasComoLeidas'])->where('alertaTipoId', '[0-9]+');
    Route::post('{alertaId}/marcar-como-leida', [Dashboard::class, 'MarcarAlertaComoLeida'])->where('alertaId', '[0-9]+');
    Route::post('{alertaId}/marcar-como-no-leida', [Dashboard::class, 'MarcarAlertaComoNoLeida'])->where('alertaId', '[0-9]+');

    /* ALERTAS DE LIQUIDACION PARA LEGACY */
    Route::get('inicio/sucursal/{sucursalId}', [Dashboard::class, 'getAlertaInicioSucursalLiquidacion']);


    /* ALERTAS DE PLANKA */
    Route::get('tareas/creados-por-mi/resumen', [Dashboard::class, 'getTareasCreadosPorMiResumen']);
});
