<?php

namespace App\Models;

use App\Services\Ventas\VentasManager;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Caja extends BaseModel
{
    use HasFactory;

    protected $table = 'cajas';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'numero',
        'fechaapertura',
        'fechacierre',
        'idusuario',
        'idsucursal',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    public function movimientosCaja()
    {
        $idusuario = $this->idusuario;
        $idsucursal = $this->idsucursal;
        $numero = $this->numero;
        $relation = $this->hasMany(MovimientoCaja::class, 'numerocaja', 'numero');

        if ($idusuario && $idsucursal && $numero) {
            $relation->where(function ($q) use ($idusuario, $idsucursal, $numero) {
                $q->where(function ($q2) use ($idusuario, $idsucursal, $numero) {
                    $q2->where('movimientoscaja.idusuario', $idusuario)
                        ->where('movimientoscaja.idsucursal', $idsucursal)
                        ->where('movimientoscaja.numerocaja', $numero);
                });
            });
        }

        return $relation;
    }

    public function movimientosCajaDestinatario()
    {
        $idusuario = $this->idusuario;
        $idsucursal = $this->idsucursal;
        $numero = $this->numero;
        $relation = $this->hasMany(MovimientoCaja::class, 'numerocajadestino', 'numero');

        if ($idusuario && $idsucursal && $numero) {
            $relation->where(function ($q) use ($idusuario, $idsucursal, $numero) {
                $q->where(function ($q2) use ($idusuario, $idsucursal, $numero) {
                    $q2->where('movimientoscaja.idusuariodestino', $idusuario)
                        ->where('movimientoscaja.idsucursaldestino', $idsucursal)
                        ->where('movimientoscaja.numerocajadestino', $numero);
                });
            });
        }

        return $relation;
    }

    public function compras()
    {
        $idusuario = $this->idusuario;
        $idsucursal = $this->idsucursal;
        $numero = $this->numero;

        $relation = $this->hasMany(Compra::class, 'numerocaja', 'numero');
        if ($idusuario && $idsucursal && $numero) {
            $relation->where('compras.idusuario', $this->idusuario)
                ->where('compras.idsucursal', $this->idsucursal);
        }
        return $relation;
    }

    public function pagos()
    {
        $idusuario = $this->idusuario;
        $idsucursal = $this->idsucursal;
        $numero = $this->numero;

        $relation = $this->hasMany(Pago::class, 'numerocaja', 'numero');

        if ($idusuario && $idsucursal && $numero) {
            $relation->where('pagos.idusuario', $this->idusuario)
                ->where('pagos.idsucursal', $this->idsucursal);
        }

        return $relation;
    }

    public function ventas()
    {
        $idusuario = $this->idusuario;
        $idsucursal = $this->idsucursal;
        $numero = $this->numero;

        $relation = $this->hasMany(VentaSucursal::class, 'numerocaja', 'numero');

        if ($idusuario && $idsucursal && $numero) {
            $relation->where('ventassucursal.idusuario', $this->idusuario)
                ->where('ventassucursal.idsucursal', $this->idsucursal);
        }
        return $relation;
    }
}
