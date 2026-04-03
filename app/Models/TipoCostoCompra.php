<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoCostoCompra extends BaseModel
{
    use HasFactory;

    protected $table = 'tiposcostoscompra';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
    ];

    public function costos(): HasMany
    {
        return $this->hasMany(CostoCompra::class, 'idtipocosto');
    }
}
