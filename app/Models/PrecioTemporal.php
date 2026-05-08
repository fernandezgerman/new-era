<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrecioTemporal extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'preciostemporales';

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
    const CREATED_AT = 'fechahoraaudicion';

    /**
     * The name of the "updated at" column.
     *
     * @var string|null
     */
    const UPDATED_AT = null;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'idusuarioaudito',
        'fechahoraaudicion',
        'idarticulo',
        'fechacaducidad',
        'cantidadmaxima',
        'idlistaprecio',
        'idsucursal',
        'cantidaddisponible',
        'activo',
        'precio',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'idusuarioaudito' => 'integer',
        'fechahoraaudicion' => 'datetime',
        'idarticulo' => 'integer',
        'fechacaducidad' => 'date',
        'cantidadmaxima' => 'integer',
        'idlistaprecio' => 'integer',
        'idsucursal' => 'integer',
        'cantidaddisponible' => 'integer',
        'activo' => 'boolean',
        'precio' => 'decimal:3',
    ];

    /**
     * Get the user that audited the temporary price.
     */
    public function usuarioAuditor()
    {
        return $this->belongsTo(User::class, 'idusuarioaudito');
    }

    /**
     * Get the article that owns the temporary price.
     */
    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    /**
     * Get the price list associated with the temporary price.
     */
    public function lista()
    {
        return $this->belongsTo(Lista::class, 'idlistaprecio');
    }

    /**
     * Get the branch associated with the temporary price.
     */
    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }
}
