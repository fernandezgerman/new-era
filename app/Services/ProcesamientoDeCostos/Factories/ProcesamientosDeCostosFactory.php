<?php

namespace App\Services\ProcesamientoDeCostos\Factories;

use App\Services\ProcesamientoDeCostos\Contracts\ProcesamientoDeCostosInterface;
use  App\Services\ProcesamientoDeCostos\Drivers\MayorCostoConImpuesto;
class ProcesamientosDeCostosFactory
{
    public static function make(): ProcesamientoDeCostosInterface
    {
        return new MayorCostoConImpuesto();
    }
}
