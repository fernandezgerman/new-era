<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Promocion extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'promociones';

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
        'descripcion',
        'activa',
        'cantidadcompra',
        'cantidadregalo',
        'fechacreacion',
        'idusuarioinserto',
        'idusuariomodifico',
        'fechamodificacion',
        'tipopromocion',
        'tipohorario',
        'horainicio',
        'horaduracion',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'activa' => 'boolean',
        'cantidadcompra' => 'decimal:2',
        'cantidadregalo' => 'decimal:2',
        'fechacreacion' => 'datetime',
        'idusuarioinserto' => 'integer',
        'idusuariomodifico' => 'integer',
        'fechamodificacion' => 'datetime',
        'horainicio' => 'integer',
        'horaduracion' => 'integer',
    ];

    /**
     * Get the articles for the promotion.
     */
    public function promocionesArticulos()
    {
        return $this->hasMany(PromocionArticulo::class, 'idpromocion');
    }
}
