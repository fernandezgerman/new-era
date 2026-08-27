<?php

use App\Http\Controllers\BalanceGeneral\BalanceGeneralController;
use Illuminate\Support\Facades\Route;

route::prefix('reportes')->group(function () {
    route::prefix('balance-general')->group(function () {
        Route::get('/totalizado', [BalanceGeneralController::class, 'getTotalizado'])
            ->name('reportes.balance-general.totalizado');

        Route::get('/por-sucursal', [BalanceGeneralController::class, 'getPorSucursal'])
            ->name('reportes.balance-general.por-sucursal');
    });
});
