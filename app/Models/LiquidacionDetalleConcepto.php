<?php

namespace App\Models;

class LiquidacionDetalleConcepto extends BaseModel
{
    protected $table = 'liquidaciondetalleconceptos';

    protected $fillable = [
        'idliquidaciondetalle',
        'idconcepto',
        'importe',
    ];

    public $timestamps = false;

    public function liquidacionDetalle()
    {
        return $this->belongsTo(LiquidacionDetalle::class, 'idliquidaciondetalle');
    }

    public function concepto()
    {
        return $this->belongsTo(LiquidacionConcepto::class, 'idconcepto');
    }
}
