<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Localidad extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'localidades';

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
     * Get the sucursales for the localidad.
     */
    public function sucursales()
    {
        return $this->hasMany(Sucursal::class, 'idlocalidad');
    }

    /**
     * Get the provincia that owns the localidad.
     */
    public function provincia()
    {
        return $this->belongsTo(Provincia::class, 'idprovincia');
    }
}
