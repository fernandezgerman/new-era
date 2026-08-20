<?php

namespace App\Models;

class VentaArticuloCompuesto extends BaseModel
{
    protected $table = 'ventasarticuloscompuestos';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idventa',
        'cantidadcompuesto',
        'fechacreacion',
        'idcomponente',
    ];

    protected $casts = [
        'id' => 'integer',
        'idventa' => 'integer',
        'cantidadcompuesto' => 'decimal:0',
        'fechacreacion' => 'datetime',
        'idcomponente' => 'integer',
    ];

    /**
     * Get the sale that this compound article belongs to.
     */
    public function venta()
    {
        return $this->belongsTo(VentaSucursal::class, 'idventa', 'idventa');
    }

    /**
     * Get the component article.
     */
    public function componente()
    {
        return $this->belongsTo(Articulo::class, 'idcomponente');
    }
}
