<?php

namespace App\Services\MediosDeCobro\Contracts;

use App\Models\Sucursal;
use App\Models\VentaSucursalCobro;
use App\Services\MediosDeCobro\DTOs\OrderDTO;

interface MedioDeCobroQRDriverInterface extends MedioDeCobroDriverInterface
{
    public function getQRImageURL(OrderDTO $orderDTO): string;

}
