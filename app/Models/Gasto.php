<?php

namespace App\Models;

use App\Services\Actualizaciones\Contracts\ActualizableItem;
use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;
use App\Services\Actualizaciones\Enums\CodigoMotivoActualizacion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Gasto extends Compra  implements ActualizableItem
{
    use HasFactory;

    public function getIdentificadoresActualizacion(): ActualizacionIdentifierDTO
    {
        return new ActualizacionIdentifierDTO(
            CodigoMotivoActualizacion::GET_ANULACION_COMPRA,
            $this->id);
    }
}
