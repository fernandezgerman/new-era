<?php

namespace App\Services\Actualizaciones\Contracts;

use App\Services\Actualizaciones\DTO\OrdenDeActualizacionDTO;

interface ActualizacionesDriverInterface
{
    public function insActualizacion(OrdenDeActualizacionDTO $ordenDeActualizacionDTO): void;
}
