<?php

namespace App\Models;

use App\Services\Actualizaciones\Contracts\ActualizableItem;
use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;
use App\Services\Actualizaciones\Enums\CodigoMotivoActualizacion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class LimiteVentaPorHoraRubro extends BaseModel implements ActualizableItem
{
    use HasFactory;

    protected $table = 'limites_venta_por_hora_rubros';

    protected $fillable = [
        'idrubro',
        'horadesde',
        'horas',
        'activo',
    ];

    protected $casts = [
        'horadesde' => 'integer',
        'horas'     => 'integer',
        'activo'    => 'boolean',
    ];

    public $timestamps = false;

    public function rubro(): BelongsTo
    {
        return $this->belongsTo(Rubro::class, 'idrubro');
    }

    public function getIdentificadoresActualizacion(): ActualizacionIdentifierDTO
    {
        return new ActualizacionIdentifierDTO(
        CodigoMotivoActualizacion::GET_LIMITE_VENTA_RUBRO_HORA, $this->id
        );
    }
}
