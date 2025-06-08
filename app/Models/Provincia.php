<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provincia extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'provincias';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the sucursales for the provincia.
     */
    public function sucursales()
    {
        return $this->hasMany(Sucursal::class, 'idprovincia');
    }

    /**
     * Get the localidades for the provincia.
     */
    public function localidades()
    {
        return $this->hasMany(Localidad::class, 'idprovincia');
    }
}
