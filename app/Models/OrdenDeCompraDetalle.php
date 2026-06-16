<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrdenDeCompraDetalle extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ordenesdecompradetalle';

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
        'idarticulo',
        'idordendecompra',
        'cantidad',
        'costoestimado',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'idarticulo' => 'integer',
        'idordendecompra' => 'integer',
        'cantidad' => 'decimal:6',
        'costoestimado' => 'decimal:3',
    ];

    /**
     * Get the articulo that owns the detail.
     */
    public function articulo(): BelongsTo
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    /**
     * Get the orden de compra that owns the detail.
     */
    public function ordenDeCompra(): BelongsTo
    {
        return $this->belongsTo(OrdenDeCompra::class, 'idordendecompra');
    }
}
