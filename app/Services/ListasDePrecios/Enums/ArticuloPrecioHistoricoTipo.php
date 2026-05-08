<?php

namespace App\Services\ListasDePrecios\Enums;

enum ArticuloPrecioHistoricoTipo: string
{
    case PROMOCION = 'Promocion';
    case PRECIO_TEMPORAL = 'Precio Temporal';
    case LISTA_PRINCIPAL = 'Lista Principal';
    case LISTA_DEPENDIENTE = 'Lista Dependiente';
}
