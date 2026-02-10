<?php

namespace App\Services\MediosDeCobro\DTOs;

use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;
use App\Services\MediosDeCobro\Enums\MedioDeCobroTipos;

class OrderStatusChangeDTO
{
    public string $externalId;
    public string $localId;
    public ?MedioDeCobroEstados $status;
    public ?MedioDeCobroTipos $tipo;
}
