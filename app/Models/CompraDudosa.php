<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompraDudosa extends BaseModel
{
    use HasFactory;

    protected $table = 'comprasdudosas';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'idcompra',
        'idcompradetalle',
        'observacionescompradudosa',
        'costoanterior',
        'precioventa',
        'tipodeduda',
        'idusuarioaudito',
        'observacionesaudicion',
        'audicionresultado',
        'idcompradetallecomparacion',
        'indicesuperior',
        'indiceinferior',
    ];

    protected $casts = [
        'idcompra' => 'integer',
        'idcompradetalle' => 'integer',
        'costoanterior' => 'decimal:3',
        'precioventa' => 'decimal:3',
        'idusuarioaudito' => 'integer',
        'idcompradetallecomparacion' => 'integer',
        'indicesuperior' => 'decimal:3',
        'indiceinferior' => 'decimal:3',
    ];

    protected $appends = [
        'audicion_descripcion'
    ];

    // Relationships
    public function compra()
    {
        return $this->belongsTo(Compra::class, 'idcompra');
    }

    public function compraDetalle()
    {
        return $this->belongsTo(CompraDetalle::class, 'idcompradetalle');
    }

    public function usuarioAudito()
    {
        return $this->belongsTo(User::class, 'idusuarioaudito');
    }

    public function compraDetalleComparacion()
    {
        return $this->belongsTo(CompraDetalle::class, 'idcompradetallecomparacion');
    }

    public function getAudicionDescripcionAttribute()
    {
        return match ((int)($this->audicionresultado)) {
            1 => 'Mal Cargada',
            2 => 'Bien cargada',
            3 => 'Precio excepcional',
            default => 'No auditada'
        };
    }
}
