<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompraAnulada extends BaseModel
{
    use HasFactory;

    protected $table = 'comprasanuladas';

    /**
     * The table does not have a single primary key 'id'.
     * Since both 'idanulacion' and 'idcompra' are unique, we can pick one.
     */
    protected $primaryKey = 'idanulacion';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'idcompra',
        'idanulacion',
        'idusuarioanulo',
        'fechacreacion',
    ];

    protected $casts = [
        'idcompra' => 'integer',
        'idanulacion' => 'integer',
        'idusuarioanulo' => 'integer',
        'fechacreacion' => 'datetime',
    ];

    // Relaciones

    public function compra()
    {
        return $this->belongsTo(Compra::class, 'idcompra');
    }

    public function usuarioAnulo()
    {
        return $this->belongsTo(User::class, 'idusuarioanulo');
    }
}
