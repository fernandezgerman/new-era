<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompraDudosaCache extends BaseModel
{
    use HasFactory;

    protected $table = 'comprasdudosascache';

    /**
     * The table does not have a primary key defined in the CREATE TABLE statement,
     * but Eloquent usually expects one. If it doesn't have one, we should set:
     * public $incrementing = false;
     * protected $primaryKey = null;
     * However, since it's a cache table, we'll assume it's read/write without a specific PK
     * unless one is added later. For now, we follow the schema.
     */
    protected $primaryKey = null;
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'idcompra',
        'iddetalle',
        'observaciones',
        'idsucursal',
        'idproveedor',
        'idarticulo',
        'costo',
        'cantidad',
        'totalfactura',
        'precioventa',
        'iddetallecostoasociado',
        'procesada',
    ];

    protected $casts = [
        'idcompra' => 'integer',
        'iddetalle' => 'integer',
        'idsucursal' => 'integer',
        'idproveedor' => 'integer',
        'idarticulo' => 'integer',
        'costo' => 'decimal:3',
        'cantidad' => 'decimal:3',
        'totalfactura' => 'decimal:3',
        'precioventa' => 'decimal:3',
        'iddetallecostoasociado' => 'integer',
        'procesada' => 'boolean',
    ];

    /**
     * Get the compra associated with the cache entry.
     */
    public function compra(): BelongsTo
    {
        return $this->belongsTo(Compra::class, 'idcompra');
    }

    /**
     * Get the compra detalle associated with the cache entry.
     */
    public function detalle(): BelongsTo
    {
        return $this->belongsTo(CompraDetalle::class, 'iddetalle');
    }

    /**
     * Get the sucursal associated with the cache entry.
     */
    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    /**
     * Get the proveedor associated with the cache entry.
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'idproveedor');
    }

    /**
     * Get the articulo associated with the cache entry.
     */
    public function articulo(): BelongsTo
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    /**
     * Get the associated cost detail (from compradetalle).
     */
    public function detalleCostoAsociado(): BelongsTo
    {
        return $this->belongsTo(CompraDetalle::class, 'iddetallecostoasociado');
    }
}
