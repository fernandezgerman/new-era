<?php

namespace App\Services\MediosDeCobro\DTOs;

use App\Models\Articulo;
use App\Models\Sucursal;
use App\Models\User;

class OrderDetalleDTO
{

    public Articulo $articulo;
    public float $cantidad;
    public float $precio_unitario;
    public string $id_unico_venta;
}
