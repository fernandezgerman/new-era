<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SucursalSelectionController;
use App\Http\Controllers\Legacy\DefaultController;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

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



