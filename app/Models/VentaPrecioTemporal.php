<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VentaPrecioTemporal extends BaseModel
{
    protected $table = 'ventaspreciostemporales';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idventasucursal',
        'idpreciotemporal',
    ];

    protected $casts = [
        'id' => 'integer',
        'idventasucursal' => 'integer',
        'idpreciotemporal' => 'integer',
    ];

    /**
     * Get the sale associated with the temporary price.
     */
    public function venta(): BelongsTo
    {
        return $this->belongsTo(VentaSucursal::class, 'idventasucursal');
    }

    /**
     * Get the temporary price associated with the sale.
     */
    public function precioTemporal(): BelongsTo
    {
        return $this->belongsTo(PrecioTemporal::class, 'idpreciotemporal');
    }
}
