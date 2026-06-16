<?php

use App\Http\ApiResources\Dashboard;
use App\Http\Controllers\MediosDeCobro\MediosDeCobroController;
use App\Http\Middleware\CheckLegacyPermissions;
use App\Http\Middleware\ValidateMercadoPagoQR;
use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id} asdasfsda

route::prefix('ordenes-de-compra')->withoutMiddleware(['restrict.access.per.hour', 'auth:sanctum'])->group(function () {
    Route::get('', [\App\Http\ApiResources\OrdenesDeCompraController::class, 'index']);
    Route::get('articulos-a-ordenar', [\App\Http\ApiResources\OrdenesDeCompraController::class, 'getArticulosAOrdenar']);
    Route::post('add', [\App\Http\ApiResources\OrdenesDeCompraController::class, 'add']);
    Route::post('add-and-send-email', [\App\Http\ApiResources\OrdenesDeCompraController::class, 'addAndSendEmail']);
    Route::get('{id}/pdf', [\App\Http\ApiResources\OrdenesDeCompraController::class, 'downloadPdf']);
    Route::post('{id}/send-email', [\App\Http\ApiResources\OrdenesDeCompraController::class, 'sendEmail']);
});
