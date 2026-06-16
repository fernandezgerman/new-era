<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrdenDeCompraEstado extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ordenesdecompraestados';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'idordendecompra',
        'idestado',
        'fechahora',
        'idusuarioestado',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'idordendecompra' => 'integer',
        'idestado' => 'integer',
        'idusuarioestado' => 'integer',
        'fechahora' => 'datetime',
    ];

    /**
     * Get the orden de compra that owns the status.
     */
    public function ordenDeCompra(): BelongsTo
    {
        return $this->belongsTo(OrdenDeCompra::class, 'idordendecompra');
    }

    /**
     * Get the status definition.
     */
    public function estado(): BelongsTo
    {
        return $this->belongsTo(EstadoOrdenDeCompra::class, 'idestado');
    }

    /**
     * Get the usuario that changed the status.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuarioestado');
    }
}
