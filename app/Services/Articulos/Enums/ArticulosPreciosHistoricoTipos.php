<?php

namespace App\Services\Articulos\Enums;

enum ArticulosPreciosHistoricoTipos: string
{
    case LISTA_PRINCIPAL = 'Lista Principal';
    case LISTA_DEPENDIENTE = 'Lista Dependiente';
    case PRECIO_TEMPORAL = 'Precio Temporal';
    case PROMOCION = 'Promocion';
}
