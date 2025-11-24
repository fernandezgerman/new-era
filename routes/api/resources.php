<?php

use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id}

route::prefix('resources')->group(function () {
    Route::get('{entity}/{id}', [ApiResourceBase::class, 'index'])->where('resources.by-id', '[0-9]+');
    Route::get('{entity}', [ApiResourceBase::class, 'index'])->where('resources.general', '[0-9]+');
    Route::post('{entity}', [ApiResourceBase::class, 'insertResource'])->where('resources.insert', '[0-9]+');
    Route::patch('{entity}/{id}', [ApiResourceBase::class, 'updateResource'])->where('resources.update', '[0-9]+');
    Route::delete('{entity}/{id}', [ApiResourceBase::class, 'deleteResource'])->where('resources.delete', '[0-9]+');
});
