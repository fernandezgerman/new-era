<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'perfiles';

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
     * Get the empresa that the perfil belongs to.
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'idempresa');
    }

    /**
     * Get the users for the perfil.
     */
    public function usuarios()
    {
        return $this->hasMany(User::class, 'idperfil');
    }
}
