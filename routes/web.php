<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Legacy\DefaultController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

//\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth:sanctum')->group(function () {
    foreach (Storage::disk('routes')->allFiles('web') as $file) {
        require_once $file;
    }
});
