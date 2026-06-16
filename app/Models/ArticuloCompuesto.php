<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticuloCompuesto extends BaseModel
{
    use HasFactory;

    protected $table = 'articuloscompuestos';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'cantidad',
        'fechamodificacion',
        'idarticulo',
        'idCompuesto',
    ];

    protected $casts = [
        'id' => 'integer',
        'cantidad' => 'decimal:0',
        'fechamodificacion' => 'datetime',
        'idarticulo' => 'integer',
        'idCompuesto' => 'integer',
    ];

    /**
     * Get the article that is the component.
     */
    public function articulo(): BelongsTo
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    /**
     * Get the composed article (parent).
     */
    public function compuesto(): BelongsTo
    {
        return $this->belongsTo(Articulo::class, 'idCompuesto');
    }
}
