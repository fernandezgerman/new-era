<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ListaDependienteExcepcion extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'listasdependientesexcepciones';

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
        'idarticulo',
        'idlista',
        'porcentaje',
        'fechahora',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'idarticulo' => 'integer',
        'idlista' => 'integer',
        'porcentaje' => 'decimal:7',
        'fechahora' => 'datetime',
    ];

    /**
     * Get the articulo associated with the exception.
     */
    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    /**
     * Get the lista associated with the exception.
     */
    public function lista()
    {
        return $this->belongsTo(Lista::class, 'idlista');
    }
}
