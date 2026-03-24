<?php

namespace App\Models;

use App\Services\AccesosPorHora\Enums\AccesosPorHoraAcciones;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AccesosPorHora extends BaseModel
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'accesosporhora';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'horadesde',
        'horahasta',
        'dia',
        'fecha',
        'accion',
        'targettype',
        'diadelasemana',
        'targetid',
    ];

    protected $appends = [
        'target',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'horadesde' => 'integer',
        'horahasta' => 'integer',
    ];

    public function getTargetAttribute($value)
    {
        if($this->targettype === 'Perfil' && $this->targetid !== null)
        {
            return get_entity_or_fail('Perfil', $this->targetid);
        }

        if($this->targettype === 'Usuario' && $this->targetid !== null)
        {

            return get_entity_or_fail('User', $this->targetid);
        }

        return null;
    }
}
