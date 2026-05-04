<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransferenciaStockDetalle extends BaseModel
{
    use HasFactory;

    protected $table = 'transferenciasstockdetalle';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idtransferenciastock',
        'idarticulo',
        'cantidad',
        'descontostock',
    ];

    protected $casts = [
        'id' => 'integer',
        'idtransferenciastock' => 'integer',
        'idarticulo' => 'integer',
        'cantidad' => 'decimal:3',
        'descontostock' => 'integer',
    ];

    public function transferenciaStock(): BelongsTo
    {
        return $this->belongsTo(TransferenciaStock::class, 'idtransferenciastock');
    }

    public function articulo(): BelongsTo
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }
}
