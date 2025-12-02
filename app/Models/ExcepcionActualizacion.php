<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExcepcionActualizacion extends Model
{
    use HasFactory;

    protected $table = 'excepcionesactualizacion';

    public $timestamps = false;


    protected $fillable = [
        'idsucursal',
        'idmotivoactualizacion',
    ];
}
