<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class SolicitudDePago extends CustomModel
{
    use HasFactory;

    protected $table = 'solicitudespago';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'idsucursal',
        'idproveedor',
        'importe',
        'fechahora',
        'idpago',
    ];

    protected $casts = [
        'id' => 'integer',
        'idsucursal' => 'integer',
        'idproveedor' => 'integer',
        'idpago' => 'integer',
        'importe' => 'decimal:3',
        'fechahora' => 'datetime',
    ];

    public function getColorAttribute(){
        return match ($this->ultimoEstado->estado) {
            'CADUCADA' => 'VIOLETA',
            'RECHAZADA' => 'ROJO',
            'APROBADA' => 'VERDE',
            default => 'AZUL',
        };
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'idproveedor');
    }

    public function estados()
    {
        return $this->hasMany(SolicitudDePagoEstado::class, 'idsolicitudpago');
    }


    public function ultimoEstado()
    {
        return $this->hasOne(SolicitudDePagoEstado::class, 'idsolicitudpago')->latestOfMany('id');
    }
}
