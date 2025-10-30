<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MercadoPagoQROrderSql extends Model
{
    // Use default connection unless specified otherwise in config
    protected $table = 'mercadopagoqrorders';

    protected $fillable = [
        'ventasucursalcobroid',
        // Note: migration column is spelled 'extarnalorderid'
        'externalorderid',
        'estado',
        'externalorderdata',
    ];

    protected $casts = [
        'externalorderdata' => 'array',
    ];

    public function notifications(): HasMany
    {
        return $this->hasMany(MercadoPagoQROrderNotification::class, 'mercadopagoqrorderid');
    }
}
