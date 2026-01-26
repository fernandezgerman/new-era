<?php

namespace App\Models;

use App\Services\Actualizaciones\Contracts\ActualizableItem;
use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;
use App\Services\Actualizaciones\Enums\CodigoMotivoActualizacion;
use Illuminate\Database\Eloquent\Model;

class VentaSucursalAnulacion extends Model implements ActualizableItem
{
    protected $table = 'ventassucursalanulacion';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'idunicoventaanulada',
        'idusuarioanulo',
        'idusuariocaja',
        'idsucursalcaja',
        'idarticulo',
        'idlista',
        'cantidad',
        'preciounitario',
        'costo',
        'fechahora',
        'costosucursal',
        'idunicoventaanulacion',
    ];

    protected $casts = [
        'cantidad' => 'decimal:3',
        'preciounitario' => 'decimal:3',
        'costo' => 'decimal:3',
        'costosucursal' => 'decimal:3',
        'fechahora' => 'datetime',
    ];

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursalcaja');
    }

    public function getIdentificadoresActualizacion(): ActualizacionIdentifierDTO
    {
        return new ActualizacionIdentifierDTO(
            CodigoMotivoActualizacion::GET_ANULACION_DE_VENTA,
            $this->id
        );
    }
}
