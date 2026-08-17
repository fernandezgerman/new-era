<?php

namespace App\Models;

use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MovimientoCajaEstado extends BaseModel
{
    use HasFactory,Compoships;

    protected $table = 'movimientoscajaestado';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idusuario',
        'idsucursal',
        'idestado',
        'fechahoramovimiento',
        'fechahoraestado',
        'descripcionestado',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }
}
