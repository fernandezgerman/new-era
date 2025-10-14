<?php

namespace App\Services\MediosDeCobro\DTOs;

use App\Models\Sucursal;

class OrderDTO
{
    public Sucursal $sucursal;
    public string $cajaIdentifier = 'CAJA001';



}
