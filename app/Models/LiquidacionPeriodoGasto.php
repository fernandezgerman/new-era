<?php

namespace App\Models;

class LiquidacionPeriodoGasto extends BaseModel
{
    protected $table = 'liquidacionesperiodogastos';

    public $timestamps = false;

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
