<?php

namespace App\Services\Actualizaciones\Contracts;

use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;

interface ActualizableItem
{
    public function getIdentificadoresActualizacion(): ActualizacionIdentifierDTO;

}
