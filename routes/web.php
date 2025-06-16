<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Legacy\DefaultController;
use Illuminate\Support\Facades\Route;
//\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
