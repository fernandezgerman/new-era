<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModoDeCobro extends Model
{
    protected $table = 'modosdecobro';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'fechahora',
        'idusuarioaudito',
        'activo',
        'descripcion',
        'comision',
        'driver',
    ];

    protected $casts = [
        'fechahora' => 'datetime',
        'activo' => 'boolean',
        'comision' => 'decimal:3',
    ];
}
