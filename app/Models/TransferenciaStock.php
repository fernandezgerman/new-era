<?php

namespace App\Models;

use App\Services\Actualizaciones\Contracts\ActualizableItem;
use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;
use App\Services\Actualizaciones\Enums\CodigoMotivoActualizacion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransferenciaStock extends BaseModel implements ActualizableItem
{
    use HasFactory;

    protected $table = 'transferenciasstock';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idsucursalorigen',
        'idsucursaldestino',
        'fechahora',
        'idestado',
        'observaciones',
        'idusuario',
        'idmotivo',
    ];

    protected $casts = [
        'id' => 'integer',
        'idsucursalorigen' => 'integer',
        'idsucursaldestino' => 'integer',
        'fechahora' => 'datetime',
        'idestado' => 'integer',
        'idusuario' => 'integer',
        'idmotivo' => 'integer',
    ];

    public function sucursalOrigen(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'idsucursalorigen');
    }

    public function sucursalDestino(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'idsucursaldestino');
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(EstadoMovimientoCaja::class, 'idestado');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function motivo(): BelongsTo
    {
        return $this->belongsTo(MotivoMovimientoStock::class, 'idmotivo');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(TransferenciaStockDetalle::class, 'idtransferenciastock');
    }

    public function firmas(): HasMany
    {
        return $this->hasMany(TransferenciaStockFirma::class, 'idtransferenciastock');
    }

    public function getIdentificadoresActualizacion(): ActualizacionIdentifierDTO
    {
        return new ActualizacionIdentifierDTO(
            CodigoMotivoActualizacion::GET_TRANSFERENCIAS_STOCK,
            $this->id
        );
    }
}
