<?php

namespace App\Models;


use Awobaz\Compoships\Compoships;

class VentaSucursal extends BaseModel
{
    use Compoships;
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
        'costosucursalcriterio',
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
        'costosucursalcriterio' => 'string',
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

    /**
     * Get the extra information for the sale.
     */
    public function extra()
    {
        return $this->hasOne(VentaSucursalExtra::class, 'idventa');
    }

    /**
     * Get the compound articles for this sale.
     */
    public function articulosCompuestos()
    {
        return $this->hasMany(VentaArticuloCompuesto::class, 'idventa', 'idventa');
    }

    /**
     * Get the discounts for this sale.
     */
    public function descuentos()
    {
        return $this->hasMany(VentaDescuento::class, 'idventa');
    }

    /**
     * Get the temporary prices for this sale.
     */
    public function preciosTemporales()
    {
        return $this->hasMany(VentaPrecioTemporal::class, 'idventasucursal');
    }

    /**
     * Get the promotion records for this sale as a regular sale.
     */
    public function promocionesVentas()
    {
        return $this->hasMany(PromocionVenta::class, 'idunicoventa', 'idventa');
    }

    /**
     * Get the promotion record for this sale as a promotional gift.
     */
    public function promocionVenta()
    {
        return $this->hasOne(PromocionVenta::class, 'idunicoventapromo', 'idventa');
    }
}
