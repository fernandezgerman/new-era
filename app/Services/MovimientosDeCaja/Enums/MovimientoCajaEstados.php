<?php

namespace App\Services\MovimientosDeCaja\Enums;

enum MovimientoCajaEstados: int
{
    case PENDIENTE = 1;
    case APROBADO = 2;
    case RECHAZADO = 3;
}
