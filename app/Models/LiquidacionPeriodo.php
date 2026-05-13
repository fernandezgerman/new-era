<?php

namespace App\Models;

use App\Collections\LiquidacionPeriodoCollection;
use App\DataAccessor\CompraDetalleDataAccessor;

class LiquidacionPeriodo extends BaseModel
{
    public function newCollection(array $models = [])
    {
        return new LiquidacionPeriodoCollection($models);
    }

    protected $table = 'liquidacionesperiodo';

    protected $fillable = [
        'descripcion',
        'fechahoradesde',
        'fechahorahasta',
        'importeinicial',
        'observaciones',
        'idestado',
        'idusuario',
        'fechahora',
        'importe',
        'fechahoracierre',
        'importerepartido',
        'idusuariocierre',
        'cambio',
    ];

    protected $casts = [
        'fechahoradesde' => 'datetime',
        'fechahorahasta' => 'datetime',
        'fechahora' => 'datetime',
        'fechahoracierre' => 'datetime',
        'importeinicial' => 'decimal:3',
        'importe' => 'decimal:3',
        'importerepartido' => 'decimal:3',
        'cambio' => 'decimal:2',
    ];

    public $timestamps = false;

    public function liquidaciones()
    {
        return $this->hasMany(Liquidacion::class, 'idliquidacionperiodo');
    }

    public function gastos()
    {
        return $this->belongsToMany(Compra::class, 'liquidacionesperiodogastos', 'idperiodo', 'idgasto');
    }
}
