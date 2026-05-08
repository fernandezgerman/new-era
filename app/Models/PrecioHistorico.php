<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrecioHistorico extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'preciohistorico';

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
     * The name of the "created at" column.
     *
     * @var string|null
     */
    const CREATED_AT = 'created_at';

    /**
     * The name of the "updated at" column.
     *
     * @var string|null
     */
    const UPDATED_AT = null;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'idusuario',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'idusuario' => 'integer',
        'status' => 'string',
        'created_at' => 'datetime',
    ];

    /**
     * Get the user that created the price history.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    /**
     * Get the detailed article price history records.
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(ArticuloPrecioHistorico::class, 'idcabecera');
    }
}
