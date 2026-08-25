<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VentaDescuento extends BaseModel
{
    protected $table = 'ventasdescuentos';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idmotivodescuento',
        'idtipodescuento',
        'valorasociado',
        'valordescuento',
        'idventa',
        'idusuarioautorizo',
    ];

    protected $casts = [
        'id' => 'integer',
        'idmotivodescuento' => 'integer',
        'idtipodescuento' => 'integer',
        'valorasociado' => 'decimal:3',
        'valordescuento' => 'decimal:3',
        'idventa' => 'integer',
        'idusuarioautorizo' => 'integer',
    ];

    /**
     * Get the reason for the discount.
     */
    public function motivoDescuento(): BelongsTo
    {
        return $this->belongsTo(MotivoDescuento::class, 'idmotivodescuento');
    }

    /**
     * Get the type of discount.
     */
    public function tipoDescuento(): BelongsTo
    {
        return $this->belongsTo(TipoDescuento::class, 'idtipodescuento');
    }

    /**
     * Get the sale associated with the discount.
     */
    public function venta(): BelongsTo
    {
        return $this->belongsTo(VentaSucursal::class, 'idventa');
    }

    /**
     * Get the user who authorized the discount.
     */
    public function usuarioAutorizo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idusuarioautorizo');
    }
}
