<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $table = 'pagos';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'numero',
        'fecha',
        'totalpago',
        'idproveedor',
        'idusuario',
        'fechahorareal',
        'idsucursal',
        'numerocaja',
        'idusuariocaja',
        'idsucursalcaja',
        'idunico',
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'fechahorareal' => 'datetime',
        'totalpago' => 'float',
        'idproveedor' => 'integer',
        'idusuario' => 'integer',
        'idsucursal' => 'integer',
        'numerocaja' => 'integer',
        'idusuariocaja' => 'integer',
        'idsucursalcaja' => 'integer',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'idproveedor');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    public function usuarioCaja()
    {
        return $this->belongsTo(User::class, 'idusuariocaja');
    }

    public function sucursalCaja()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursalcaja');
    }
}
