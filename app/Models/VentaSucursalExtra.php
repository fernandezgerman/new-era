<?php

namespace App\Models;

class VentaSucursalExtra extends BaseModel
{
    protected $table = 'ventassucursalextra';

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'idventa',
        'idcompradetalle',
        'criterio',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'idventa' => 'integer',
        'idcompradetalle' => 'integer',
        'criterio' => 'integer',
    ];

    /**
     * Get the sale that owns the extra info.
     */
    public function venta()
    {
        return $this->belongsTo(VentaSucursal::class, 'idventa');
    }

    /**
     * Get the purchase detail associated with this extra info.
     */
    public function compraDetalle()
    {
        return $this->belongsTo(CompraDetalle::class, 'idcompradetalle');
    }
}
