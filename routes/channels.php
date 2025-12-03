<?php

use App\Models\Sucursal;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int)$user->id === (int)$id;
});


$sucursales = Sucursal::where('activo', 1)->get();

foreach ($sucursales as $sucursal) {
    Broadcast::channel('Sucursal-' . $sucursal->id, function ($user) {
        return true; //(int)$user->id === 1;
    });
}

Broadcast::channel('general', function ($user) {
    return (int)$user->id === 1;
});
