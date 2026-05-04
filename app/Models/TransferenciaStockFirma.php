<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransferenciaStockFirma extends BaseModel
{
    use HasFactory;

    protected $table = 'transferenciasstockfirmas';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idtransferenciastock',
        'idusuario',
        'fechahora',
        'idestado',
        'observaciones',
        'rol',
    ];

    protected $casts = [
        'id' => 'integer',
        'idtransferenciastock' => 'integer',
        'idusuario' => 'integer',
        'fechahora' => 'datetime',
        'idestado' => 'integer',
    ];

    public function transferenciaStock(): BelongsTo
    {
        return $this->belongsTo(TransferenciaStock::class, 'idtransferenciastock');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(EstadoMovimientoCaja::class, 'idestado');
    }
}
