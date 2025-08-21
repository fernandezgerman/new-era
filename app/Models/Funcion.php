<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Funcion extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'funciones';

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
     * Get the module that the function belongs to.
     */
    public function modulo()
    {
        return $this->belongsTo(Modulo::class, 'idmodulo');
    }

    /**
     * Get the profiles that have this function.
     */
    public function perfiles()
    {
        return $this->belongsToMany(Perfil::class, 'perfilfuncion', 'idfuncion', 'idperfil');
    }

    /**
     * Get the companies that have this function.
     */
    public function empresas()
    {
        return $this->belongsToMany(Empresa::class, 'empresafuncion', 'idfuncion', 'idempresa')
            ->withPivot('activo');
    }
}
