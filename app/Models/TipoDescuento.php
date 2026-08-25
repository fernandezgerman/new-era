<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoDescuento extends BaseModel
{
    protected $table = 'tiposdescuentos';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'observaciones',
    ];

    protected $casts = [
        'id' => 'integer',
        'nombre' => 'string',
        'observaciones' => 'string',
    ];

    /**
     * Get the reasons associated with this discount type.
     */
    public function motivos(): HasMany
    {
        return $this->hasMany(MotivoDescuento::class, 'idtipodescuento');
    }
}
