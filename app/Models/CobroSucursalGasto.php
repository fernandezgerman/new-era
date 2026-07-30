<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CobroSucursalGasto extends BaseModel
{
    protected $table = 'cobrosucursalgastos';

    protected $fillable = [
        'idcompra',
        'idventasucursalcobro',
    ];

    public function gasto(): BelongsTo
    {
        return $this->belongsTo(Compra::class, 'idcompra');
    }

    public function ventasucursalcobro(): BelongsTo
    {
        return $this->belongsTo(VentaSucursalCobro::class, 'idventasucursalcobro');
    }
}
