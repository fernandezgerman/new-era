<?php

namespace App\Models;

class LiquidacionDetalle extends BaseModel
{
    protected $table = 'listadetalle';

    protected $fillable = [
        'idlista',
        'idarticulo',
        'idrubro',
        'precio',
        'costo',
        'aplicapminutilidad',
        'porcentajeminimo',
        'porcentajelista',
        'excepcion',
        'totalimpuestoscosto',
    ];

    protected $primaryKey = ['idlista', 'idarticulo'];
    public $incrementing = false;
    public $timestamps = false;

    public function lista()
    {
        return $this->belongsTo(Lista::class, 'idlista');
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    public function rubro()
    {
        return $this->belongsTo(Rubro::class, 'idrubro');
    }
}
