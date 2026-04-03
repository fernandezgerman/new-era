<?php

namespace App\Services\Articulos\Enums;

enum ArticulosCostoHistoricoMotivos: string
{
    case COMPRA = 'COMPRA';
    case RECALCULO = 'RECALCULO';
    case CONF_PRECIOS = 'CONF_PRECIOS';
    case ARTICULOS_UPDATE = 'ARTICULOS UPDATE';
    case ARTICULOS_INSERT = 'ARTICULOS INSERT';
}
