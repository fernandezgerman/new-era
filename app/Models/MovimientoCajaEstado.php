<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoCajaEstado extends Model
{
    use HasFactory;

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
