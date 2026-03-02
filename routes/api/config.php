<?php

use Illuminate\Support\Facades\Route;

// GET /api/{entity}/{id} asdasfsda

route::prefix('config')->group(function () {

    Route::get('/value', function(Request $request){

        return config(request()->get('key'));
    })->name('config.value');

});
