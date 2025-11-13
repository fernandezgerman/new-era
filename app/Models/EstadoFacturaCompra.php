<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadoFacturaCompra extends Model
{
    use HasFactory;

    protected $table = 'estadosfacturacompra';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        // add columns if needed
    ];

    public function compras()
    {
        return $this->hasMany(Compra::class, 'idestado');

    }
}
