<?php

namespace App\Services\MediosDeCobro\DTOs;

use App\Models\ModoDeCobro;
use App\Models\Sucursal;
use App\Models\User;
use App\Services\MediosDeCobro\DTOs\Collections\OrderDetalleDTOCollection;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoOrderResponseDTO;

class OrderDTO
{
    public const TYPE_POINT = 'point';
    public const TYPE_QR = 'qr';
    public ?int $localId;
    public ?string $externalId;
    public ?string $idunicolegacy;

    public string $tipo = self::TYPE_QR; //point or qr
    public Sucursal $sucursal;
    public User $usuario;
    public ?ModoDeCobro $modoDeCobro;
    public OrderDetalleDTOCollection $detalles;
    public ?MercadoPagoOrderResponseDTO $gatewayResponse = null;
    public string $idempotencyKey;
}
