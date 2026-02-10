<?php

namespace App\Services\MediosDeCobro\Enums;

enum MedioDeCobroTipos: string
{
    case TARJETAS = 'Tarjetas';

    case QR = 'QR';
    case NO_DETERMINADO = 'No determinado';

}
