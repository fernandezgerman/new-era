<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lista extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'listas';

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
     * Get the sucursales for the lista.
     */
    public function sucursales()
    {
        return $this->hasMany(Sucursal::class, 'idlista');
    }
}
