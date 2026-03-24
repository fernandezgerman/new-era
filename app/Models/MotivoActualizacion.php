<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class MotivoActualizacion extends BaseModel
{
    use HasFactory;

    protected $table = 'motivosactualizaciones';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'cierreautomatico',
    ];

    protected $casts = [
        'cierreautomatico' => 'boolean',
    ];
}
