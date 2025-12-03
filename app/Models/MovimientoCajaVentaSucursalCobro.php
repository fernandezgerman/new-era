<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimientoCajaVentaSucursalCobro extends Model
{
    protected $table = 'movimientocajaventasucursalcobro';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'idmovimientocaja',
        'idventasucursalcobro',
        'created_at',
        'updated_at',
    ];

    public function movimientoCaja()
    {
        return $this->belongsTo(MovimientoCaja::class, 'idmovimientocaja');
    }

    public function ventaSucursalCobro()
    {
        return $this->belongsTo(VentaSucursalCobro::class, 'idventasucursalcobro');
    }
}
