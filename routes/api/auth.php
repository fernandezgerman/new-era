<?php

use Illuminate\Support\Facades\Route;

// Public endpoint to obtain an API token
Route::post('/auth/token', [\App\Http\Controllers\AuthController::class, 'getToken'])
    ->withoutMiddleware(['auth:sanctum', \App\Http\Middleware\CheckLegacyPermissions::class]);
