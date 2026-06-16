<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrdenDeCompra extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ordenesdecompra';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'idproveedor',
        'idsucursal',
        'observaciones',
        'fechahora',
        'idusuario',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'idproveedor' => 'integer',
        'idsucursal' => 'integer',
        'idusuario' => 'integer',
        'fechahora' => 'datetime',
    ];

    /**
     * Get the proveedor that owns the orden de compra.
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'idproveedor');
    }

    /**
     * Get the sucursal that owns the orden de compra.
     */
    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    /**
     * Get the usuario that created the orden de compra.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    /**
     * Get the detalles for the orden de compra.
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(OrdenDeCompraDetalle::class, 'idordendecompra');
    }

    /**
     * Get the estados for the orden de compra.
     */
    public function estados(): HasMany
    {
        return $this->hasMany(OrdenDeCompraEstado::class, 'idordendecompra');
    }
}
