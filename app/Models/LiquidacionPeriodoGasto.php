<?php

namespace App\Models;

class LiquidacionPeriodoGasto extends BaseModel
{
    protected $table = 'liquidacionesperiodogastos';

    public $timestamps = false;

    // Al ser una tabla pivot con llave primaria compuesta,
    // Laravel no soporta de forma nativa $primaryKey como array en Eloquent básico,
    // pero para un modelo Pivot o si se usa como modelo simple:
    protected $primaryKey = ['idgasto', 'idperiodo'];
    public $incrementing = false;

    protected $fillable = [
        'idgasto',
        'idperiodo',
    ];

    public function gasto()
    {
        return $this->belongsTo(Compra::class, 'idgasto');
    }

    public function periodo()
    {
        return $this->belongsTo(LiquidacionPeriodo::class, 'idperiodo');
    }
}
