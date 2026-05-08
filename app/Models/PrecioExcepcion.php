<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrecioExcepcion extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'preciosexcepciones';

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
        'idlista',
        'idarticulo',
        'precio',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'idlista' => 'integer',
        'idarticulo' => 'integer',
        'precio' => 'decimal:3',
        'fechacreacion' => 'datetime',
        'fechamodificacion' => 'datetime',
    ];

    /**
     * Get the lista that owns the excepcion.
     */
    public function lista()
    {
        return $this->belongsTo(Lista::class, 'idlista');
    }

    /**
     * Get the articulo that owns the excepcion.
     */
    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }
}
