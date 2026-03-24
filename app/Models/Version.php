<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Version extends BaseModel
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
