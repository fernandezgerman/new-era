<?php

namespace App\Models;

class LiquidacionPeriodo extends BaseModel
{
    protected $table = 'liquidacionesperiodo';

    protected $fillable = [
        'fechahora',
        'idusuario',
        'cerrado',
        'fechahoracerrado',
    ];

    public $timestamps = false;

    public function liquidaciones()
    {
        return $this->hasMany(Liquidacion::class, 'idliquidacionperiodo');
    }
}
