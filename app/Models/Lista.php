<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lista extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'listas';

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
        'nombre',
        'descripcion',
        'porcsobrecosto',
        'calculaenbaseaotralista',
        'idlistabase',
        'aplicaredondeoalaumentar',
        'activo',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'porcsobrecosto' => 'decimal:3',
        'calculaenbaseaotralista' => 'boolean',
        'idlistabase' => 'integer',
        'aplicaredondeoalaumentar' => 'boolean',
        'activo' => 'boolean',
    ];

    /**
     * Get the details for the lista.
     */
    public function detalles()
    {
        return $this->hasMany(ListaDetalle::class, 'idlista');
    }

    /**
     * Get the historic prices for the lista.
     */
    public function historicoPrecios()
    {
        return $this->hasMany(ArticuloPrecioHistorico::class, 'idlista');
    }

    /**
     * Get the exceptions for the lista.
     */
    public function excepciones()
    {
        return $this->hasMany(PrecioExcepcion::class, 'idlista');
    }

    /**
     * Get the dependent list exceptions for the lista.
     */
    public function excepcionesListasDependientes()
    {
        return $this->hasMany(ListaDependienteExcepcion::class, 'idlista');
    }

    /**
     * Get the temporary prices for the lista.
     */
    public function preciosTemporales()
    {
        return $this->hasMany(PrecioTemporal::class, 'idlistaprecio');
    }

    /**
     * Get the sucursales for the lista.
     */
    public function sucursales()
    {
        return $this->hasMany(Sucursal::class, 'idlista');
    }

    /**
     * Get the base list that this list calculates from.
     */
    public function listaBase()
    {
        return $this->belongsTo(Lista::class, 'idlistabase');
    }

    /**
     * Get the lists that are based on this list.
     */
    public function listasDerivadas()
    {
        return $this->hasMany(Lista::class, 'idlistabase');
    }
}
