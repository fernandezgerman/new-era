<?php

namespace App\Models;

use App\DataAccessor\CompraDetalleDataAccessor;
use App\Services\Compras\Enums\TipoDeSalida;
use Awobaz\Compoships\Compoships;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Compra extends BaseModel
{
    use HasFactory, Compoships;

    protected $table = 'compras';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'fechaemision',
        'fechahora',
        'tipofactura',
        'idusuario',
        'idsucursal',
        'totalfactura',
        'idproveedor',
        'numero',
        'numerocaja',
        'idusuariocaja',
        'idsucursalcaja',
        'mododepago',
        'idestado',
        'idtipocomprobante',
        'observaciones',
        'fechacreacion',
        'idunico',
        'idletra',
    ];

    protected $casts = [
        'fechaemision' => 'datetime',
        'fechahora' => 'datetime',
        'fechacreacion' => 'datetime',
        'totalfactura' => 'float',
        'idusuario' => 'integer',
        'idsucursal' => 'integer',
        'idproveedor' => 'integer',
        'numerocaja' => 'integer',
        'idusuariocaja' => 'integer',
        'idsucursalcaja' => 'integer',
        'mododepago' => 'integer',
        'idestado' => 'integer',
        'idtipocomprobante' => 'integer',
        'idletra' => 'integer',
    ];

    protected $appends = [
        'tipo_de_salida',
    ];

    public function getTipoDeSalidaAttribute(): string
    {
        $cd = CompraDetalle::where('idcabecera', $this->id)
            ->where('idarticulo', config('medios_de_cobro.drivers.MercadoPagoPoint.gastos.articuloId'))
            ->first();

        if(!blank($cd))
        {
            return TipoDeSalida::IMPUESTOS_EN_COBROS->value;
        }

        $cd = CompraDetalle::where('idcabecera', $this->id)
            ->join('articulos','idarticulo','=','articulos.id')
            ->join('rubros','idrubro','=','rubros.id')
            ->where('rubros.esrubrogastos', 1)
            ->first();

        if(!blank($cd))
        {
            return TipoDeSalida::GASTO_GENERAL->value;
        }

        return TipoDeSalida::COMPRAS->value;
    }
    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'idproveedor');
    }

    public function estado()
    {
        return $this->belongsTo(EstadoFacturaCompra::class, 'idestado');
    }

    public function tipoComprobante()
    {
        return $this->belongsTo(TipoComprobante::class, 'idtipocomprobante');
    }

    public function usuarioCaja()
    {
        return $this->belongsTo(User::class, 'idusuariocaja');
    }

    public function sucursalCaja()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursalcaja');
    }

    public function anulacion()
    {
        return $this->hasOne(CompraAnulada::class, 'idcompra');
    }
    public function impuestos()
    {
        return $this->hasMany(ImpuestoCompra::class, 'idcabecera');
    }

    public function compraDetalles()
    {
        return $this->hasMany(CompraDetalle::class, 'idcabecera');
    }
    public function periodosLiquidacion()
    {
        return $this->belongsToMany(LiquidacionPeriodo::class, 'liquidacionesperiodogastos', 'idgasto', 'idperiodo');
    }
}
