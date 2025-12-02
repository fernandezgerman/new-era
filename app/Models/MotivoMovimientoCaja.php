<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MotivoMovimientoCaja extends Model
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
