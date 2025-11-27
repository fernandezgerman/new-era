<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\MedioDeCobroSucursalConfiguracion
 *
 * Represents configuration for a specific payment method (modo de cobro)
 * at a given branch (sucursal), including optional destination cashbox
 * sucursal/usuario for transfers.
 */
class MedioDeCobroSucursalConfiguracion extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'mediodecobrosucursalconfiguraciones';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'idsucursal',
        'idmododecobro',
        'habilitarconfiguracion',
        'transferirmonto',
        'idsucursalcajadestino',
        'idusuariocajadestino',
        'metadata',
        'configuration_checked',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'habilitarconfiguracion' => 'boolean',
            'transferirmonto' => 'boolean',
            'metadata' => 'array', // JSON column
            'configuration_checked' => 'boolean',
        ];
    }

    /**
     * Sucursal a la que pertenece esta configuración.
     */
    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    /**
     * Modo de cobro asociado a esta configuración.
     */
    public function modoDeCobro()
    {
        return $this->belongsTo(ModoDeCobro::class, 'idmododecobro');
    }

    /**
     * Sucursal de caja destino (opcional) para transferencias.
     */
    public function sucursalCajaDestino()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursalcajadestino');
    }

    /**
     * Usuario de caja destino (opcional) para transferencias.
     */
    public function usuarioCajaDestino()
    {
        return $this->belongsTo(User::class, 'idusuariocajadestino');
    }
}
