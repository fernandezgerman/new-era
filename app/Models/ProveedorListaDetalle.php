<?php

namespace App\Models;

class ProveedorListaDetalle extends BaseModel
{
    protected $table = 'proveedorlistadetalle';

    protected $fillable = [
        'idproveedorlista',
        'idarticulo',
        'descripciondelproveedor',
        'precio',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
    ];

    public function proveedorLista()
    {
        return $this->belongsTo(ProveedorLista::class, 'idproveedorlista');
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }
}
