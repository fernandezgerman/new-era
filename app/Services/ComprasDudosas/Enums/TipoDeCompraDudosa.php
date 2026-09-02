<?php

namespace App\Services\ComprasDudosas\Enums;

enum TipoDeCompraDudosa: string
{
    case COSTO_MAS_ALTO_QUE_PRECIO = 'COSTO_MAS_PRECIO';
    case COSTO_CERO = 'COSTO_CERO';
    case COSTO_DISMINUYO_DEMASIADO = 'COSTO_MAS_BAJO';

    case COSTO_AUMENTO_DEMASIADO = 'COSTO_MAS_ALTO';


}
