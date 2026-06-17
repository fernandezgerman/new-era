<?php

namespace App\Services\PeriodosContables;

use App\Models\LiquidacionPeriodo;
use App\Services\PeriodosContables\Exceptions\NoHayUnPeriodoContableAbiertoException;

class PeriodosContablesManager
{
    public function obtenerPeriodoActual(): LiquidacionPeriodo
    {
        $periodo = LiquidacionPeriodo::where('idestado', 0)->orderBy('id')->first();

        if (!$periodo) {
            throw new NoHayUnPeriodoContableAbiertoException();
        }

        return $periodo;
    }
}
