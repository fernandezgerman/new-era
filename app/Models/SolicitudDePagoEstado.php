<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class SolicitudDePagoEstado extends CustomModel
{
    use HasFactory;

    protected $table = 'solicitudespagoestados';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'idsolicitudpago',
        'estado',
        'fechahora',
    ];

    protected $casts = [
        'id' => 'integer',
        'idsolicitudpago' => 'integer',
        'fechahora' => 'datetime',
    ];

    public function solicitud()
    {
        return $this->belongsTo(SolicitudDePago::class, 'idsolicitudpago');
    }
}
