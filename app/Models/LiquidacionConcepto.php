<?php

namespace App\Models;

class LiquidacionConcepto extends BaseModel
{
    protected $table = 'liquidacionesconceptos';

    protected $fillable = [
        'codigo',
        'descripcion',
        'suma',
    ];

    public $timestamps = false;

    public function detalles()
    {
        return $this->hasMany(LiquidacionDetalleConcepto::class, 'idconcepto');
    }
}
