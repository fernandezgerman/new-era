<?php

namespace App\Services\MediosDeCobro\DTOs;

use App\Models\ModoDeCobro;
use App\Models\Sucursal;
use App\Models\User;
use App\Services\MediosDeCobro\DTOs\Collections\OrderDetalleDTOCollection;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoOrderResponseDTO;
use App\Services\MediosDeCobro\DTOs\Collections\OrderPaymentChargeDetailDTOCollection;

class OrderPaymentDetailDTO
{
    public ?int $localId;
    public ?string $externalId;

    public OrderPaymentChargeDetailDTOCollection $chargeDetails;
    public OrderDTO $orderDTO;
    public \stdClass $metadata;
    public string $paymentTypeId;
    public string $tipoDeCobro;
}
