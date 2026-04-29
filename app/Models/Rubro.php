<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rubro extends BaseModel
{
    use HasFactory;

    protected $table = 'rubros';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'porcentajeminimoutilidad',
        'esrubrogastos',
        'lu',
        'ma',
        'mi',
        'ju',
        'vi',
        'sa',
        'do',
    ];

    protected $casts = [
        'porcentajeminimoutilidad' => 'float',
        'esrubrogastos'            => 'boolean',
        'lu'                       => 'boolean',
        'ma'                       => 'boolean',
        'mi'                       => 'boolean',
        'ju'                       => 'boolean',
        'vi'                       => 'boolean',
        'sa'                       => 'boolean',
        'do'                       => 'boolean',
    ];

    public function articulos()
    {
        return $this->hasMany(Articulo::class, 'idrubro');
    }
}
