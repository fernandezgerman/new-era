<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromocionVenta extends BaseModel
{
    use Compoships;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'promocionesventas';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = ['idunicoventa', 'idunicoventapromo'];

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'idunicoventa',
        'idunicoventapromo',
        'idpromocion',
        'fechahora',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'idunicoventa' => 'string',
        'idunicoventapromo' => 'string',
        'idpromocion' => 'integer',
        'fechahora' => 'datetime',
    ];

    /**
     * Get the promotion associated with the record.
     */
    public function promocion(): BelongsTo
    {
        return $this->belongsTo(Promocion::class, 'idpromocion');
    }

    /**
     * Get the sale associated with the record (idunicoventa).
     */
    public function venta(): BelongsTo
    {
        return $this->belongsTo(VentaSucursal::class, 'idunicoventa', 'idventa');
    }

    /**
     * Get the promotional sale associated with the record (idunicoventapromo).
     * Mapped to VentaSucursal.id as requested.
     */
    public function ventaPromo(): BelongsTo
    {
        return $this->belongsTo(VentaSucursal::class, 'idunicoventapromo', 'id');
    }
}
