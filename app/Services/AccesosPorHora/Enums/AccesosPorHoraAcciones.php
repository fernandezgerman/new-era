<?php

namespace App\Services\AccesosPorHora\Enums;

enum AccesosPorHoraAcciones: string
{
    case RESTRINGIR = 'RESTRINGIR';
    case PERMITIR = 'PERMITIR';
    case TODOS = 'TODOS';
}
