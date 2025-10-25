<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Marca extends CustomModel
{
    use HasFactory;

    protected $table = 'marcas';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        // define fields if needed
    ];

    public function articulos()
    {
        return $this->hasMany(Articulo::class, 'idmarca');
    }
}
