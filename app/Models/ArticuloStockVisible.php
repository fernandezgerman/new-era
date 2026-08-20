<?php

namespace App\Models;

/**
 * Class ArticuloStockVisible
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $fechacreacion
 *
 * @property-read Articulo $articulo
 */
class ArticuloStockVisible extends BaseModel
{
    protected $table = 'articulosconstockvisible';

    protected $primaryKey = 'id';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'id',
        'fechacreacion',
    ];

    protected $casts = [
        'id' => 'integer',
        'fechacreacion' => 'date',
    ];

    /**
     * Get the article associated with this record.
     */
    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'id');
    }
}
