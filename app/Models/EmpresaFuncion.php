<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class EmpresaFuncion extends Pivot
{
    use HasFactory;

    protected $table = 'empresafuncion';

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'idempresa',
        'idfuncion',
        'activo',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'idempresa');
    }

    public function funcion()
    {
        return $this->belongsTo(Funcion::class, 'idfuncion');
    }
}
