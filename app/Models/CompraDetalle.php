<?php

namespace App\Models;


use App\DataAccessor\CompraDetalleDataAccessor;

class CompraDetalle extends BaseModel
{
    // Table name does not follow Laravel's conventions
    protected $table = 'comprasdetalle';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'idcabecera',
        'idarticulo',
        'cantidad',
        'precio',
        'costoanterior',
    ];

    protected $casts = [
        'idcabecera'    => 'integer',
        'idarticulo'    => 'integer',
        'cantidad'      => 'float',
        // Keep 3 decimals as per schema (decimal(20,3))
        'precio'        => 'decimal:3',
        'costoanterior' => 'decimal:3',
    ];

    protected $appends = [
        'costo_con_impuestos',
        'total_linea'
    ];

    // Relationships
    public function costos()
    {
        return $this->hasMany(CostoCompra::class, 'iddetalle');
    }

    public function getCostoConImpuestosAttribute(): ?float
    {
        $newCompraDetalleDataAccessor = new CompraDetalleDataAccessor($this);

        return $newCompraDetalleDataAccessor->getUnitarioConImpuestos();
    }

    public function getTotalLineaAttribute(): ?float
    {
        return $this->cantidad * $this->precio;
    }
    public function compra()
    {
        return $this->belongsTo(Compra::class, 'idcabecera');
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }
}
