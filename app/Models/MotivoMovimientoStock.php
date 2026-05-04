<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class MotivoMovimientoStock extends BaseModel
{
    use HasFactory;

    protected $table = 'motivosmovimientosstock';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'activo',
    ];

    protected $casts = [
        'activo' => 'integer',
    ];
}
