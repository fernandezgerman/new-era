<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImportacionProveedorLista extends BaseModel
{
    use HasFactory;

    protected $table = 'importacion_proveedor_listas';

    protected $fillable = [
        'idimportacionproveedorlistacabecera',
        'idproveedor',
        'idarticulo',
        'campo1',
        'campo2',
        'campo3',
        'campo4',
        'campo5',
        'campo6',
        'campo7',
        'campo8',
        'campo9',
        'campo10',
        'campo11',
        'descripcionproceso',
    ];

    protected $casts = [
        'descripcionproceso' => 'array',
    ];

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'idproveedor');
    }

    public function articulo(): BelongsTo
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    public function cabecera(): BelongsTo
    {
        return $this->belongsTo(ImportacionProveedorListaCabecera::class, 'idimportacionproveedorlistacabecera');
    }
}
