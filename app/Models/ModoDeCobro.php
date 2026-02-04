<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Model;

class ModoDeCobro extends Model
{
    protected $table = 'modosdecobro';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'fechahora',
        'idusuarioaudito',
        'activo',
        'descripcion',
        'comision',
        'driver',
    ];

    protected $casts = [
        'fechahora' => 'datetime',
        'activo' => 'boolean',
        'comision' => 'decimal:3',
    ];

    protected $appends = [
        'driver_config_id',
        'config'
    ];

    public function getDriverConfigIdAttribute(){
        $driverConfig = config('medios_de_cobro.drivers.'.$this->driver);
        if($driverConfig === null){
            throw new Exception('Driver no configurado para el medio de cobro');
        }
        return $driverConfig['config_id'];
    }

    public function getConfigAttribute(){
        return config('medios_de_cobro.drivers.'.$this->driver);
    }


    public function getImage($val){
        $driverConfig = config('medios_de_cobro.drivers.'.$this->driver);

        return $driverConfig['resolve_image']($val);
    }

}
