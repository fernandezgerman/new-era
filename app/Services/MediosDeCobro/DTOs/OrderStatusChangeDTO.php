<?php

namespace App\Services\MediosDeCobro\DTOs;

use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;

class OrderStatusChangeDTO
{
    public string $externalId;
    public string $localId;
    public ?MedioDeCobroEstados $status;
}
