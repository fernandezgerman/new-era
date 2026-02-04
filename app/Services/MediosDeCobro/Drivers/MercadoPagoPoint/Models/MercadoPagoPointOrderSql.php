<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Models;

use Illuminate\Database\Eloquent\Model;

class MercadoPagoPointOrderSql extends Model
{
    protected $table = 'mercadopagopointorders';

    protected $fillable = [
        'ventasucursalcobroid',
        'externalorderid',
        'estado',
        'externalorderdata',
    ];

    protected $casts = [
        'externalorderdata' => 'array',
    ];
}
