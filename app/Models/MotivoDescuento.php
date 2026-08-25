<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MotivoDescuento extends BaseModel
{
    protected $table = 'motivosdescuentos';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'observaciones',
        'idtipodescuento',
        'valorasociado',
        'aplicaimportelimite',
        'importelimite',
        'disponibleporperfil',
        'activo',
    ];

    protected $casts = [
        'id' => 'integer',
        'idtipodescuento' => 'integer',
        'valorasociado' => 'decimal:3',
        'aplicaimportelimite' => 'boolean',
        'importelimite' => 'decimal:3',
        'disponibleporperfil' => 'boolean',
        'activo' => 'boolean',
    ];

    /**
     * Get the type of discount associated with this reason.
     */
    public function tipoDescuento(): BelongsTo
    {
        return $this->belongsTo(TipoDescuento::class, 'idtipodescuento');
    }
}
