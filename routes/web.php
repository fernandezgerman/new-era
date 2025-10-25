<?php

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


Route::get('/test', function() {
    // Fetch latest 15 articulos ordered by id desc and pass to view
    $articulos = \App\Models\Articulo::orderBy('id', 'desc')->limit(15)->get(['id','codigo','nombre','costo']);
    return view('mediosDePago.order-preview-test', compact('articulos'));
});

