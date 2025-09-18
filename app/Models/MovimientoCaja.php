<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoCaja extends Model
{
    use HasFactory;

    protected $table = 'movimientoscaja';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idusuario',
        'idusuariodestino',
        'idsucursal',
        'idsucursaldestino',
        'idestado',
        'numerocaja',
        'fechahoramovimiento',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function usuarioDestino()
    {
        return $this->belongsTo(User::class, 'idusuariodestino');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    public function sucursalDestino()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursaldestino');
    }
}
