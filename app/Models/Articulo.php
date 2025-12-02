<?php

namespace App\Models;

use App\Services\Actualizaciones\Contracts\ActualizableItem;
use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;
use App\Services\Actualizaciones\Enums\CodigoMotivoActualizacion;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Articulo extends CustomModel implements ActualizableItem
{
    use HasFactory;

    protected $table = 'articulos';
    protected $primaryKey = 'id';
    public $timestamps = false; // Table uses custom date columns

    // Allow mass assignment for known columns. Adjust as needed if more fields are added.
    protected $fillable = [
        'idrubro',
        'codigo',
        'nombre',
        'descripcion',
        'aplicapminutilidad',
        'activo',
        'fechamodificacion',
        'fechacreacion',
        'costo',
        'escompuesto',
        'idmarca',
        'idcompradetalle',
        'activohasta',
        'disponibilidadespecial',
    ];

    protected $casts = [
        'id' => 'integer',
        'idrubro' => 'integer',
        'idmarca' => 'integer',
        'idcompradetalle' => 'integer',
        'aplicapminutilidad' => 'integer',
        'activo' => 'integer',
        'escompuesto' => 'boolean',
        'disponibilidadespecial' => 'boolean',
        'fechamodificacion' => 'datetime',
        'fechacreacion' => 'datetime',
        'activohasta' => 'date',
        // Use string for decimal to avoid float precision issues; optionally use AsDecimal cast in newer Laravel
        'costo' => 'decimal:3',
    ];

    // Relationships
    public function marca()
    {
        return $this->belongsTo(Marca::class, 'idmarca');
    }

    public function rubro()
    {
        return $this->belongsTo(Rubro::class, 'idrubro');
    }

    public function getIdentificadoresActualizacion(): ActualizacionIdentifierDTO
    {
        return new ActualizacionIdentifierDTO(
            CodigoMotivoActualizacion::GET_ARTICULOS,
            $this->id
        );
    }
}
