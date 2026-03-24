<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class AgrupacionCaja extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'agrupacioncajas';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'descripcion',
        'activo',
        'importeinicial',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'importeinicial' => 'float',
        ];
    }

    /**
     * Users that belong to this agrupación de caja.
     */
    public function usuarios()
    {
        return $this->hasMany(AgrupacionCajaUsuario::class, 'idagrupacioncaja');
    }

    /**
     * Usuarios vinculados a esta agrupación en relación a cajas/sucursales.
     */
    public function cajas()
    {
        return $this->hasMany(AgrupacionCajaCaja::class, 'idagrupacioncaja');
    }
}
