<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CostoCompra extends BaseModel
{
    use HasFactory;

    protected $table = 'costoscompra';

    public $timestamps = false;

    protected $fillable = [
        'iddetalle',
        'idtipocosto',
        'importe',
    ];

    protected $casts = [
        'iddetalle' => 'integer',
        'idtipocosto' => 'integer',
        'importe' => 'decimal:3',
    ];

    public function compraDetalle(): BelongsTo
    {
        return $this->belongsTo(CompraDetalle::class, 'iddetalle');
    }

    public function tipoCosto(): BelongsTo
    {
        return $this->belongsTo(TipoCostoCompra::class, 'idtipocosto');
    }
}
