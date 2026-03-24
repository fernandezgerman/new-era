<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExcepcionActualizacion extends BaseModel
{
    use HasFactory;

    protected $table = 'excepcionesactualizacion';

    public $timestamps = false;


    protected $fillable = [
        'idsucursal',
        'idmotivoactualizacion',
    ];
}
