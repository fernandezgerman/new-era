<?php

namespace App\Services\Compras\Enums;

enum TipoDeSalida: string
{
    case GASTO_GENERAL = 'gasto_general';
    case GASTO_DE_LIQUIDACION = 'gasto_de_liquidacion';

    case SUELDOS = 'sueldos';
    case COMPRAS = 'compras';
    case IMPUESTOS_EN_COBROS = 'impuestos_en_cobros';

}
