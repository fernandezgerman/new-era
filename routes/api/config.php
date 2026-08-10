<?php

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;

// GET /api/{entity}/{id} asdasfsda

route::prefix('config')->group(function () {

    Route::get('/value', function(Request $request){

        return config(request()->get('key'));
    })->name('config.value');

});

route::prefix('permisos')->group(function () {
    Route::get('/check', function(){
        $arr = session('permisos');
        $restringido = Arr::get($arr, Request()->input('codigo'),'PERMITIDO') === "RESTRINGIDO";

        return json_encode([
            Request()->input('codigo') => !$restringido
        ]);
    })->name('config.value');

});
