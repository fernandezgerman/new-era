<?php

namespace App\Services\Compras\Enums;

enum TipoComprobanteCompra: int
{
    case FACTURA = 1;
    case NOTA_DE_CREDITO = 2;
}
