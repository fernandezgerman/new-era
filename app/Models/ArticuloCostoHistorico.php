<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticuloCostoHistorico extends BaseModel
{
    use HasFactory;

    protected $table = 'articuloscostoshistorico';

    public $timestamps = false;

    protected $fillable = [
        'idarticulo',
        'idcompradetalle',
        'fechahora',
        'medio',
        'idusuario',
        'precioauxiliar',
    ];

    protected $casts = [
        'idarticulo' => 'integer',
        'idcompradetalle' => 'integer',
        'fechahora' => 'datetime',
        'idusuario' => 'integer',
        'precioauxiliar' => 'decimal:3',
    ];

    public function articulo(): BelongsTo
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    public function compraDetalle(): BelongsTo
    {
        return $this->belongsTo(CompraDetalle::class, 'idcompradetalle');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

}
