<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ArticuloPrecioHistorico extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'articulopreciohistorico';

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
    const CREATED_AT = 'created_at';

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
        'idcabecera',
        'idarticulo',
        'tipo',
        'idlista',
        'oldvalues',
        'newvalues',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'idcabecera' => 'integer',
        'idarticulo' => 'integer',
        'idlista' => 'integer',
        'oldvalues' => 'array',
        'newvalues' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Get the articulo that owns the historico.
     */
    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    /**
     * Get the lista that owns the historico.
     */
    public function lista()
    {
        return $this->belongsTo(Lista::class, 'idlista');
    }

    /**
     * Get the header for the historic price change.
     */
    public function cabecera()
    {
        return $this->belongsTo(PrecioHistorico::class, 'idcabecera');
    }
}
