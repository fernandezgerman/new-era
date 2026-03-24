<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class MotivoMovimientoCaja extends BaseModel
{
    use HasFactory;

    protected $table = 'motivosmovimientoscaja';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'descripcion',
        'requiereaprobacion',
        'esretirodecaja',
        'esaportedecaja',
        'activo',
    ];
}
