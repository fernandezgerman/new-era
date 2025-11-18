<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaSucursalCobroArticulo extends Model
{
    protected $table = 'ventasucursalcobroarticulos';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'idventasucursalcobro',
        'idarticulo',
        'cantidad',
        'importe',
        'idunicoventa',
    ];

    protected $casts = [
        'cantidad' => 'decimal:3',
        'importe' => 'decimal:3',
    ];

    public function cobro()
    {
        return $this->belongsTo(VentaSucursalCobro::class, 'idventasucursalcobro');
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }
}
