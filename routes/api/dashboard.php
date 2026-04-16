<?php

use App\Http\ApiResources\Dashboard;
use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id} asdasfsda

route::prefix('dashboard')->group(function () {
    Route::get('left-menu', [Dashboard::class, 'getUserMenu']);
    Route::get('alertas', [Dashboard::class, 'getAlertas']);
    Route::get('alerta/{alertaId}/detalles', [Dashboard::class, 'getAlertaDetalles']);
    Route::post('alerta/alerta-tipo/{alertaTipoId}/marcar-como-leidas', [Dashboard::class, 'MarcarAlertasComoLeidas'])->where('alertaTipoId', '[0-9]+');
    Route::post('alerta/{alertaId}/marcar-como-leida', [Dashboard::class, 'MarcarAlertaComoLeida'])->where('alertaId', '[0-9]+');
    Route::post('alerta/{alertaId}/marcar-como-no-leida', [Dashboard::class, 'MarcarAlertaComoNoLeida'])->where('alertaId', '[0-9]+');
});


