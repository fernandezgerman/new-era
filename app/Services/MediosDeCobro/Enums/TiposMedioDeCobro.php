<?php

namespace App\Services\MediosDeCobro\Enums;

enum TiposMedioDeCobro: string
{
    case QR = "qr";

    case POST_NET = "postnet";
}
