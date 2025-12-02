<?php

namespace App\Services\Actualizaciones;

use App\Models\Sucursal;
use App\Services\Actualizaciones\Contracts\ActualizableItem;
use App\Services\Actualizaciones\Contracts\ActualizacionesDriverInterface;
use App\Services\Actualizaciones\DTO\OrdenDeActualizacionDTO;

class ActualizacionesManager
{
    public function __construct(private ActualizacionesDriverInterface $actualizacionesDriverInterface)
    {

    }

    public function insertarActualizacion(ActualizableItem $actualizableItem, ?Sucursal $sucursal = null): void
    {
        $this->actualizacionesDriverInterface->insActualizacion(
            new OrdenDeActualizacionDTO(
                $actualizableItem->getIdentificadoresActualizacion(),
                $sucursal === null ? null : [$sucursal->id]
            )
        );
    }
}
