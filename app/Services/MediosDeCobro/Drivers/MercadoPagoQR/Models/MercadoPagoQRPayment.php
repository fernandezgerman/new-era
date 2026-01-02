<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MercadoPagoQRPayment extends Model
{
    protected $table = 'mercadopagoqrpayments';

    protected $fillable = [
        'mercadopagoqrorderid',
        'externalpaymentid',
        'externalpaymentdata',
    ];

    protected $casts = [
        'externalpaymentdata' => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(MercadoPagoQROrderSql::class, 'mercadopagoqrorderid');
    }
}
