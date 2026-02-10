<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Enum;
enum MercadoPagoQRStatus: string
{
    case EXPIRED = "expired";
    case PROCESSED = "processed";

    case CREATED = "created";

    case CANCELED = "canceled";

    case REFUNDED = "refunded";

}
