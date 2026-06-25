<?php

namespace App\Services\QueryResolvers\Queries\LimpiezaDeArticulos\Enums;

enum LimpiezaDeArticulosQueryResolverTipoDeReporte: string
{
    case ARTICULOS_COMPRADOS_HACE_X = 'articulos_comprados_hace_x';
    case ARTICULOS_NO_VENDIDOS_HACE_X = 'articulos_no_vendidos_hace_x';

    case ARTICULOS_ACTIVOS_SIN_EXISTENCIAS = 'articulos_activos_sin_existencias';
}
