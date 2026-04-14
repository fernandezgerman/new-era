<?php

namespace App\Models;

class Liquidacion extends BaseModel
{
    protected $table = 'liquidaciones';

    protected $fillable = [
        'idusuario',
        'fechahoradesde',
        'fechahorahasta',
        'idliquidacionperiodo',
        'importerendido',
        'observaciones',
        'idestado',
    ];

    public $timestamps = false;

    public function liquidacionPeriodo()
    {
        return $this->belongsTo(LiquidacionPeriodo::class, 'idliquidacionperiodo');
    }
}
