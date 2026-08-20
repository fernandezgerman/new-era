<?php

namespace App\Http\Controllers\VentaSucursal;

use App\Http\Controllers\BaseController;
use App\Services\AsyncProcess\AsyncProcessManager;


class VentaSucursalController extends BaseController
{
    public function procesarVenta(int $idventasucursal)
    {

        AsyncProcessManager::handle(
            new  \App\Services\AsyncProcess\DTOs\AsyncProcessVentaSucursalDTO($idventasucursal)
        );

        return ['exito' => true];
    }
}
