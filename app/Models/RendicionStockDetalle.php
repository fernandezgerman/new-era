<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class RendicionStockDetalle extends CustomModel
{
    use HasFactory;

    protected $table = 'rendicionstockdetalle';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'idrendicion',
        'idarticulo',
        'cantidadsistema',
        'cantidadrendida',
        'fechahora',
        'costo',
        'valorsistema',
        'valorrendido',
        'precioventa',
    ];

    protected $casts = [
        'id' => 'integer',
        'idrendicion' => 'integer',
        'idarticulo' => 'integer',
        'cantidadsistema' => 'decimal:3',
        'cantidadrendida' => 'decimal:3',
        'fechahora' => 'datetime',
        'costo' => 'decimal:3',
        'valorsistema' => 'decimal:3',
        'valorrendido' => 'decimal:3',
        'precioventa' => 'decimal:3',
    ];
    protected $appends = [
        'hora',
    ];
    public function rendicion()
    {
        return $this->belongsTo(RendicionStock::class, 'idrendicion');
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    public function getHoraAttribute()
    {

        return $this->fechahora?->format('H:i') ?? null;
    }
}
