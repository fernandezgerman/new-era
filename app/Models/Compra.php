<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    use HasFactory;

    protected $table = 'compras';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'fechaemision',
        'fechahora',
        'tipofactura',
        'idusuario',
        'idsucursal',
        'totalfactura',
        'idproveedor',
        'numero',
        'numerocaja',
        'idusuariocaja',
        'idsucursalcaja',
        'mododepago',
        'idestado',
        'idtipocomprobante',
        'observaciones',
        'fechacreacion',
        'idunico',
        'idletra',
    ];

    protected $casts = [
        'fechaemision' => 'datetime',
        'fechahora' => 'datetime',
        'fechacreacion' => 'datetime',
        'totalfactura' => 'float',
        'idusuario' => 'integer',
        'idsucursal' => 'integer',
        'idproveedor' => 'integer',
        'numerocaja' => 'integer',
        'idusuariocaja' => 'integer',
        'idsucursalcaja' => 'integer',
        'mododepago' => 'integer',
        'idestado' => 'integer',
        'idtipocomprobante' => 'integer',
        'idletra' => 'integer',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'idproveedor');
    }

    public function estado()
    {
        return $this->belongsTo(EstadoFacturaCompra::class, 'idestado');
    }

    public function tipoComprobante()
    {
        return $this->belongsTo(TipoComprobante::class, 'idtipocomprobante');
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
