<?php

namespace App\Models;

use App\Enums\ImportacionEstado;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ImportacionProveedorListaCabecera extends BaseModel
{
    use HasFactory;

    protected $table = 'importacion_proveedor_lista_cabecera';

    protected $fillable = [
        'idusuario',
        'estado',
        'config',
    ];

    protected $casts = [
        'estado' => ImportacionEstado::class,
        'config' => 'array',
    ];

    public function detalles(): HasMany
    {
        return $this->hasMany(ImportacionProveedorLista::class, 'idimportacionproveedorlistacabecera');
    }
}
