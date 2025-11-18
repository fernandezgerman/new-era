<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoComprobante extends Model
{
    use HasFactory;

    protected $table = 'tiposcomprobantes';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        // Define minimally common fields if needed
    ];

    public function compras()
    {
        return $this->hasMany(Compra::class, 'idtipocomprobante');
    }
}
