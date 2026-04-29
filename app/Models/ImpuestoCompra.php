<?php

namespace App\Models;

class ImpuestoCompra extends BaseModel
{
    protected $table = 'impuestoscompras';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idimpuesto',
        'idcabecera',
        'discrimina',
        'suma',
        'valor',
    ];

    protected $casts = [
        'idimpuesto' => 'integer',
        'idcabecera' => 'integer',
        'discrimina' => 'boolean',
        'suma'       => 'boolean',
        'valor'      => 'float',
    ];

    public function compra()
    {
        return $this->belongsTo(Compra::class, 'idcabecera');
    }

    public function impuesto()
    {
        // Assuming an Impuesto model will exist or exists
        return $this->belongsTo(Impuesto::class, 'idimpuesto');
    }
}
