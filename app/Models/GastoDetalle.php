<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GastoDetalle extends Model
{
    // Table name does not follow Laravel's conventions
    protected $table = 'comprasdetalle';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
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

    // Relationships
    public function compra()
    {
        return $this->belongsTo(Compra::class, 'idcabecera');
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }
}
