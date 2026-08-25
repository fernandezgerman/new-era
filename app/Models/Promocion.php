<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Promocion extends BaseModel
{
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
    public $timestamps = true;

    /**
     * The name of the "created at" column.
     *
     * @var string|null
     */
    const CREATED_AT = 'fechacreacion';

    /**
     * The name of the "updated at" column.
     *
     * @var string|null
     */
    const UPDATED_AT = 'fechamodificacion';

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
        'idusuarioinserto',
        'idusuariomodifico',
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
        'id' => 'integer',
        'activa' => 'boolean',
        'cantidadcompra' => 'decimal:2',
        'cantidadregalo' => 'decimal:2',
        'fechacreacion' => 'datetime',
        'idusuarioinserto' => 'integer',
        'idusuariomodifico' => 'integer',
        'fechamodificacion' => 'datetime',
        'tipopromocion' => 'string',
        'tipohorario' => 'string',
        'horainicio' => 'integer',
        'horaduracion' => 'integer',
    ];

    /**
     * Get the user who created the promotion.
     */
    public function usuarioInserto(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuarioinserto');
    }

    /**
     * Get the user who last modified the promotion.
     */
    public function usuarioModifico(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuariomodifico');
    }

    /**
     * Get the articles associated with this promotion.
     */
    public function articulos()
    {
        return $this->hasMany(PromocionArticulo::class, 'idpromocion');
    }

    /**
     * Get the sales associated with this promotion.
     */
    public function ventas()
    {
        return $this->hasMany(PromocionVenta::class, 'idpromocion');
    }
}
