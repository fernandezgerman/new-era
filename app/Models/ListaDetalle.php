<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ListaDetalle extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'listadetalle';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = ['idlista', 'idarticulo'];

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

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
        'idlista',
        'idarticulo',
        'idrubro',
        'precio',
        'costo',
        'aplicapminutilidad',
        'porcentajeminimo',
        'porcentajelista',
        'excepcion',
        'totalimpuestoscosto',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'idlista' => 'integer',
        'idarticulo' => 'integer',
        'idrubro' => 'integer',
        'precio' => 'decimal:3',
        'costo' => 'decimal:3',
        'aplicapminutilidad' => 'integer',
        'porcentajeminimo' => 'decimal:3',
        'porcentajelista' => 'decimal:3',
        'excepcion' => 'decimal:3',
        'totalimpuestoscosto' => 'decimal:3',
    ];

    /**
     * Set the keys for a save update query.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery($query)
    {
        $keys = $this->getKeyName();
        if (!is_array($keys)) {
            return parent::setKeysForSaveQuery($query);
        }

        foreach ($keys as $keyName) {
            $query->where($keyName, '=', $this->getAttribute($keyName));
        }

        return $query;
    }

    /**
     * Get the lista that owns the detalle.
     */
    public function lista()
    {
        return $this->belongsTo(Lista::class, 'idlista');
    }

    /**
     * Get the articulo that owns the detalle.
     */
    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    /**
     * Get the rubro that owns the detalle.
     */
    public function rubro()
    {
        return $this->belongsTo(Rubro::class, 'idrubro');
    }
}
