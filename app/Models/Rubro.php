<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rubro extends CustomModel
{
    use HasFactory;

    protected $table = 'rubros';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        // define fields if needed
    ];

    public function articulos()
    {
        return $this->hasMany(Articulo::class, 'idrubro');
    }
}
