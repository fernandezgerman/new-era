<?php

namespace App\Models;


class VentaSucursal extends BaseModel
{
    protected $table = 'ventassucursal';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idusuario',
        'idsucursal',
        'idarticulo',
        'idlista',
        'cantidad',
        'preciounitario',
        'costo',
        'fechaenvio',
        'fechacreacion',
        'numerocaja',
        'idventa',
        'costosucursal',
    ];

    protected $casts = [
        'id' => 'integer',
        'idusuario' => 'integer',
        'idsucursal' => 'integer',
        'idarticulo' => 'integer',
        'idlista' => 'integer',
        'cantidad' => 'decimal:3',
        'preciounitario' => 'decimal:3',
        'costo' => 'decimal:3',
        'fechaenvio' => 'datetime',
        'fechacreacion' => 'datetime',
        'numerocaja' => 'integer',
        'costosucursal' => 'decimal:3',
    ];

    /**
     * Get the user that made the sale.
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    /**
     * Get the sucursal where the sale was made.
     */
    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    /**
     * Get the article that was sold.
     */
    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    /**
     * Get the price list used for the sale.
     */
    public function lista()
    {
        return $this->belongsTo(Lista::class, 'idlista');
    }
}
