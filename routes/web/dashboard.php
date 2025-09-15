<?php

use Illuminate\Support\Facades\Route;
use App\Http\ApiResources\ApiResourceBase;

// GET /api/{entity}/{id}


Route::get('/', [\App\Http\Controllers\Dashboard\DashboardController::class, 'index'])->where('id', '[0-9]+');



