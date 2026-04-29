<?php

use App\Events\Events\MediosDeCobro\MediosDeCobroUpdatedEvent;
use App\Http\Controllers\AuthController;
use App\Models\Compra;
use App\Services\AsyncProcess\AsyncProcessManager;
use App\Services\ProcesamientoDeCostos\ProcesamientoDeCostosManager;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

//\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->middleware('mobile.redirection')->name('login');
Route::post('/login', [AuthController::class, 'login'])->middleware('mobile.redirection');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/test-job', function() {
    /*
    $asyncTest = new  \App\Services\AsyncProcess\DTOs\AsyncProcessTestDTO();
    AsyncProcessManager::handle($asyncTest);
*/

    /*$checkFactura = Compra::query()->where('id', 846622)->first();

    */

    //app(ProcesamientoDeCostosManager::class)->actualizarReferenciaDeCostos(713818);
/*

    $asyncProcesamientoDeCompra = new  \App\Services\AsyncProcess\DTOs\AsyncProcessActualizarReferenciasCostosPorDetallesDTO(
        compraDetalles: collect([5938295])
    );
    AsyncProcessManager::handle($asyncProcesamientoDeCompra);
*/
    /*
    $asyncProcesamientoDeCompra = new  \App\Services\AsyncProcess\DTOs\AsyncProcessActualizarReferenciasCostosDTO(
        compraId: 846478
    );
    AsyncProcessManager::handle($asyncProcesamientoDeCompra);*/

    $asyncTest = new  \App\Services\AsyncProcess\DTOs\AsyncProcessTestDTO();
    AsyncProcessManager::handle($asyncTest);

//    app(ProcesamientoDeCostosManager::class)->actualizarReferenciaDeCostoscompraDetallesIds([5938292]);

})->name('test-job');

Route::middleware(['auth:sanctum', 'restrict.access.per.hour'])->group(function () {
    foreach (Storage::disk('routes')->allFiles('web') as $file) {
        require_once $file;
    }
});

// Routes protected by custom credentials middleware
Route::middleware(['custom.auth'])
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])
    ->prefix('medios-de-pago')->group(function () {
        foreach (Storage::disk('routes')->allFiles('customAuthProtected') as $file) {
            require_once $file;
        }
    });

if(env('APP_ENV') == 'local'){
    foreach (Storage::disk('routes')->allFiles('dev-routes') as $file) {
        require_once $file;
    }
}
