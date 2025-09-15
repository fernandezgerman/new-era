<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/user', function (Request $request) {
    $user = $request->user();
    $user->load('perfil');
    return $user;
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/sucursal/{sucursalId}/establecer-actual', [\App\Http\ApiResources\Authentication::class, 'selectSucursal']);

    foreach (Storage::disk('routes')->allFiles('api') as $file) {
        require_once $file;
    }
});

Route::post('/login', [\App\Http\ApiResources\Authentication::class, 'login']);
Route::post('/logout', [\App\Http\ApiResources\Authentication::class, 'logout'])->name('api.logout');
