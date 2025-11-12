<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MercadoPagoQROrderNotification extends Model
{
    protected $table = 'mercadopagoqrordernotifications';

    protected $fillable = [
        'mercadopagoqrorderid',
        'estado',
        'notificationdata',
    ];

    protected $casts = [
        'notificationdata' => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(MercadoPagoQROrderSql::class, 'mercadopagoqrorderid');
    }
}
