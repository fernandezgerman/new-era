<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Proveedor extends CustomModel
{
    use HasFactory;

    protected $table = 'proveedores';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        // Define minimally common fields if needed; unknown columns are omitted for safety
    ];

    /**
     * Compras realizadas a este proveedor
     */
    public function compras()
    {
        return $this->hasMany(Compra::class, 'idproveedor');
    }
}
