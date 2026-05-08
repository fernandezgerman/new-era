<?php

namespace App\Services\ListasDePrecios;

use App\Models\PrecioHistorico;
use App\Services\ListasDePrecios\Contracts\PrecioHistoricoDTOInterface;
use App\Services\ListasDePrecios\Factories\ArticuloPrecioHistoricoFactory;

class ListasDePreciosManager
{
    public function logPrecioHistorico(
        PrecioHistorico $precioHistorico,
        PrecioHistoricoDTOInterface $precioHistoricoDTOInterface
    )
    {
        $articuloPrecioHistorico = ArticuloPrecioHistoricoFactory::make($precioHistoricoDTOInterface);
        $articuloPrecioHistorico->idcabecera = $precioHistorico->id;

        if($articuloPrecioHistorico->oldvalues !== null && $articuloPrecioHistorico->newvalues !== null)
        {
            $articuloPrecioHistorico->save();
        }

    }
}
