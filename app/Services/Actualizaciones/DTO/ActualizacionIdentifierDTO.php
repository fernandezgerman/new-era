<?php

namespace App\Services\Actualizaciones\DTO;

use App\Services\Actualizaciones\Enums\CodigoMotivoActualizacion;
use App\Services\Actualizaciones\Exceptions\ActualizacionesInvalidaDataException;
use Illuminate\Support\Carbon;

class ActualizacionIdentifierDTO
{
    public function __construct(
        public CodigoMotivoActualizacion $codigoMotivoActualizacion,
        public int $idItem,
        public ?Carbon $idFecha = null,
        public ?int $idUser = null,
    )
    {
    }
}
