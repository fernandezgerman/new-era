<?php

namespace App\Enums;

enum ImportacionEstado: string
{
    case PENDIENTE = 'PENDIENTE';
    case PROCESANDO = 'PROCESANDO';
    case TERMINADO = 'TERMINADO';
}
