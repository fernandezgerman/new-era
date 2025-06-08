<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UsuarioSucursal extends Pivot
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'usuariossucursales';

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
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'idusuario',
        'idsucursal',
        'activo',
    ];

    /**
     * Get the user that owns the usuario_sucursal.
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    /**
     * Get the sucursal that owns the usuario_sucursal.
     */
    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }
}
