<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Version extends Model
{
    use HasFactory;

    protected $table = 'versiones';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'idmotivoactualizacion',
        'version',
        'fechahoracreacion',
        'cerrada',
        'fechahoracierre',
    ];

    protected $casts = [
        'cerrada' => 'boolean',
        'fechahoracreacion' => 'datetime',
        'fechahoracierre' => 'datetime',
    ];
}
