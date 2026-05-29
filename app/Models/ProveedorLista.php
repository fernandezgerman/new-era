<?php

namespace App\Models;

class ProveedorLista extends BaseModel
{
    protected $table = 'proveedorlistas';

    protected $fillable = [
        'idproveedor',
        'idusuario',
        'fechalista',
        'config',
    ];

    protected $casts = [
        'fechalista' => 'date',
        'config' => 'json',
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'idproveedor');
    }

    public function detalles()
    {
        return $this->hasMany(ProveedorListaDetalle::class, 'idproveedorlista');
    }
}
