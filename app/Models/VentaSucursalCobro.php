<?php

namespace App\Models;

use App\Services\MediosDeCobro\Enums\MedioDeCobroEstados;
use Illuminate\Database\Eloquent\Model;
use phpDocumentor\Parser\Exception;

class VentaSucursalCobro extends Model
{

    protected $table = 'ventasucursalcobros';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'id',
        'idusuario',
        'idsucursal',
        'idmododecobro',
        'estado',
        'importe',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'importe' => 'decimal:3',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    public function modoDeCobro()
    {
        return $this->belongsTo(ModoDeCobro::class, 'idmododecobro');
    }

    public function articulos()
    {
        return $this->hasMany(VentaSucursalCobroArticulo::class, 'idventasucursalcobro');
    }

    public function save(array $options = [])
    {
        if (
            (
                $this->estado === MedioDeCobroEstados::PENDIENTE->value ||
                $this->estado === MedioDeCobroEstados::APROBADO->value
            )
            &&
            $this->idmododecobro === null
        ) {
            throw new Exception('El cobro no puede pasar a PENDIENTE o APROBADO sin un modo de cobro especificado');
        }
        return parent::save($options);
    }

}
