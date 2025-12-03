<?php

namespace App\Models;

use App\Services\Actualizaciones\Contracts\ActualizableItem;
use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;
use App\Services\Actualizaciones\Enums\CodigoMotivoActualizacion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class MovimientoCaja extends Model implements ActualizableItem
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
        'idmotivo',
        'numerocaja',
        'numerocajadestino',
        'fechahoramovimiento',
        'fechahorarecibida',
        'importe',
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

    public function getIdentificadoresActualizacion(): ActualizacionIdentifierDTO
    {
        return new ActualizacionIdentifierDTO(
            CodigoMotivoActualizacion::GET_MOVIMIENTOS_DE_CAJA,
            $this->idusuario,
            Carbon::parse($this->fechahoramovimiento),
            null
        );
    }
}
