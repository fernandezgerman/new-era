<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;


//Route::middleware('')->group(function () {
    foreach (Storage::disk('routes')->allFiles('api') as $file)
    {
        require_once $file;
    }
//});
