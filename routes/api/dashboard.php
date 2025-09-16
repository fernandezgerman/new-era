<?php

use App\Http\ApiResources\Dashboard;
use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id}

route::prefix('dashboard')->group(function () {
    Route::get('left-menu', [Dashboard::class, 'getUserMenu']);
    Route::get('alertas', [Dashboard::class, 'getAlertas']);
});


