<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class PromocionArticulo extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'promocionesarticulos';

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
     * @var array
     */
    protected $fillable = [
        'idpromocion',
        'idarticulo',
        'porcentaje',
        'cantidad',
        'precio',
        'activo',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'idpromocion' => 'integer',
        'idarticulo' => 'integer',
        'porcentaje' => 'decimal:3',
        'cantidad' => 'decimal:3',
        'precio' => 'decimal:3',
        'activo' => 'boolean',
    ];

    /**
     * Get the article that owns the promotion.
     */
    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    /**
     * Get the promotion that this record belongs to.
     */
    public function promocion()
    {
        return $this->belongsTo(Promocion::class, 'idpromocion');
    }
}
