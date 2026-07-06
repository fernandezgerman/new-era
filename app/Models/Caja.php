<?php

namespace App\Models;

use App\Services\Ventas\VentasManager;
use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Caja extends BaseModel
{
    use HasFactory, Compoships;

    protected $table = 'cajas';

    public $timestamps = false;

    public $incrementing = false;

    protected $fillable = [
        'numero',
        'fechaapertura',
        'fechacierre',
        'idusuario',
        'idsucursal',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    public function movimientosCaja()
    {
        return $this->hasMany(MovimientoCaja::class,
            ['idusuario', 'idsucursal', 'numerocaja'], ['idusuario', 'idsucursal', 'numero']);
    }

    public function movimientosCajaDestinatario()
    {
        return $this->hasMany(MovimientoCaja::class,
            ['idusuariodestino', 'idsucursaldestino', 'numerocajadestino'], ['idusuario', 'idsucursal', 'numero']);
    }

    public function compras()
    {
        return $this->hasMany(Compra::class,
            ['idusuariocaja', 'idsucursalcaja', 'numerocaja'], ['idusuario', 'idsucursal', 'numero'])
            ->where('mododepago', 1);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class,
            ['idusuariocaja', 'idsucursalcaja', 'numerocaja'], ['idusuario', 'idsucursal', 'numero']);
    }

    public function ventas()
    {
        return $this->hasMany(VentaSucursal::class,
            ['idusuario', 'idsucursal', 'numerocaja'], ['idusuario', 'idsucursal', 'numero']);
    }
}
