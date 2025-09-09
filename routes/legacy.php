<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Legacy\DefaultController;
use Illuminate\Support\Facades\Route;
//\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,

// Sucursal Selection Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/select-sucursal', [AuthController::class, 'showSelectionForm'])->name('sucursal.selection');
    Route::post('/select-sucursal', [AuthController::class, 'selectSucursal'])->name('sucursal.select');

    Route::any('/principal.php',[DefaultController::class, 'defaultView'])->name('legacy.principal');

    Route::get('/', [DefaultController::class, 'defaultView']);
});

// Protected Routes
Route::middleware(['auth', \App\Http\Middleware\EnsureSucursalIsSelected::class])->group(function () {

});

Route::any('/paginas/webservices/{path}.php', [\App\Http\Controllers\Legacy\LegacyPhpController::class, 'handleWSDL']);

// Route for handling all .php files (except principal.php which is handled separately)
Route::any('/{path}.php', [\App\Http\Controllers\Legacy\LegacyPhpController::class, 'handlePhpFile'])
    ->where('path', '(?!principal).*') // Negative lookahead to exclude 'principal'
    ->middleware('auth')
    ->name('legacy.php-file');

Route::get('/template', [DefaultController::class, 'template']);


