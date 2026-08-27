<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SucursalRevalorizacion extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'sucursalesrevalorizaciones';

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
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'idsucursal',
        'idusuario',
        'fechahora',
        'valororiginal',
        'valoringresado',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fechahora' => 'datetime',
        'valororiginal' => 'decimal:3',
        'valoringresado' => 'decimal:3',
    ];

    /**
     * Get the sucursal that owns the revalorizacion.
     */
    public function sucursal(): BelongsTo
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    /**
     * Get the usuario that owns the revalorizacion.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuario');
    }
}
