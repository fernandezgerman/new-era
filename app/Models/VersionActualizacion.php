<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VersionActualizacion extends Model
{
    use HasFactory;

    protected $table = 'versionesactualizacion';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'idversion',
        'idsucursal',
        'iditem',
        'cerrada',
        'fechahoracierre',
        'actualizada',
    ];

    protected $casts = [
        'cerrada' => 'boolean',
        'actualizada' => 'boolean',
        'fechahoracierre' => 'datetime',
    ];
}
