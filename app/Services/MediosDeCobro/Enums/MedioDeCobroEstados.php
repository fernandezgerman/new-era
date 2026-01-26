<?php

namespace App\Services\MediosDeCobro\Enums;

enum MedioDeCobroEstados: string
{
    case NUEVA = 'nueva';

    case PENDIENTE = 'pendiente';
    case APROBADO = 'aprobado';
    case RECHAZADO = 'rechazado';
    case CANCELADO_POR_EL_USUARIO = 'cancelado_por_el_usuario';
    case EXPIRO = 'expiro';

    case REEMBOLSADO = 'reembolsado';

    case PROCESANDO_REEMBOLSO = 'procesando_reembolso';

}
