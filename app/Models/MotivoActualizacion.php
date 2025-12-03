<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotivoActualizacion extends Model
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
