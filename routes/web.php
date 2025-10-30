<?php

use App\Events\Events\MediosDeCobro\MediosDeCobroUpdatedEvent;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

//\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->middleware('mobile.redirection')->name('login');
Route::post('/login', [AuthController::class, 'login'])->middleware('mobile.redirection');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth:sanctum')->group(function () {
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


Route::get('/test', function () {
    // Fetch latest 15 articulos ordered by id desc and pass to view
    $articulos = \App\Models\Articulo::orderBy('id', 'desc')->limit(8)->get(['id', 'codigo', 'nombre', 'costo']);
    return view('mediosDePago.order-preview-test', compact('articulos'));
});


Route::get('/sendEvent', function () {

    $ventaSucursalCobro = \App\Models\VentaSucursalCobro::where('id', 137)->first();
    event(app(\App\Events\Events\MediosDeCobro\MediosDeCobroStatusChangeEvent::class, ['ventaSucursalCobro' => $ventaSucursalCobro]));

    return 'Hecho';
});


Route::get('/t', function () {

    $id  = ('suc-12_usr-1_1761676832');
    $var = "id:{$id};request-id:026e4b6e-4af3-43e1-a18a-9e409a264e44;ts:1761604838";

    $key = env('MERCADO_PAGO_WEBHOOK_SECRET_KEY');
    $cyphedSignature = hash_hmac('sha256', $var, $key);

    return $cyphedSignature;
});
