<?php

namespace App\Services\Actualizaciones\DTO;

class OrdenDeActualizacionDTO
{
    public function __construct(
        public ActualizacionIdentifierDTO $actualizacionIdentifier,
        public ?array $sucursalesId = null,
    )
    {
    }
}
