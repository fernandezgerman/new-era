<?php

use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id}

route::prefix('resources')->group(function () {
    Route::get('{entity}/{id}', [ApiResourceBase::class, 'index'])->where('id', '[0-9]+');
});


