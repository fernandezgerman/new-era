<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PerfilFuncion extends Pivot
{
    use HasFactory;

    protected $table = 'perfilfuncion';

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'idperfil',
        'idfuncion',
    ];

    public function perfil()
    {
        return $this->belongsTo(Perfil::class, 'idperfil');
    }

    public function funcion()
    {
        return $this->belongsTo(Funcion::class, 'idfuncion');
    }
}
