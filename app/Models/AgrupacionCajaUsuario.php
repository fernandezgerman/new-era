<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class AgrupacionCajaUsuario extends Pivot
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'agrupacioncajausuarios';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

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
        'idagrupacioncaja',
        'idusuario',
    ];

    public function agrupacion(): BelongsTo
    {
        return $this->belongsTo(AgrupacionCaja::class, 'idagrupacioncaja');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuario');
    }
}
