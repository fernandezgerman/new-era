<?php

namespace App\Models;

use App\Services\RendicionesStock\Enums\RendicionStockEstados;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;

class RendicionStock extends CustomModel
{
    use HasFactory;

    protected $table = 'rendicionesstock';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'idusuario',
        'idsucursal',
        'idrubro',
        'idestado',
        'fechaapertura',
        'fechacierre',
        'diferencia',
    ];

    protected $casts = [
        'id' => 'integer',
        'idusuario' => 'integer',
        'idsucursal' => 'integer',
        'idrubro' => 'integer',
        'idestado' => 'integer',
        'fechaapertura' => 'datetime',
        'fechacierre' => 'datetime',
        'diferencia' => 'decimal:3',
    ];

    // Expose computed values in serialized outputs
    protected $appends = [
        'valorRendido',
        'valorSistema',
        'estado',
        'hora',
    ];

    public function rubro()
    {
        return $this->belongsTo(Rubro::class, 'idrubro');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }

    // Custom attributes
    public function getValorRendidoAttribute()
    {
        // (select sum(if(valorrendido is null,0,valorrendido)) from rendicionstockdetalle where idrendicion = rendicionesstock.id)
        $total = DB::table('rendicionstockdetalle')
            ->where('idrendicion', $this->id)
            ->select(DB::raw('COALESCE(SUM(IF(valorrendido IS NULL, 0, valorrendido)), 0) as total'))
            ->value('total');

        return (float) $total;
    }

    public function getEstadoAttribute()
    {
        return RendicionStockEstados::tryFrom($this->idestado)->name;
    }

    public function getValorSistemaAttribute()
    {
        // (select sum(if(valorsistema is null,0,valorsistema)) from rendicionstockdetalle where idrendicion = rendicionesstock.id)
        $total = DB::table('rendicionstockdetalle')
            ->where('idrendicion', $this->id)
            ->select(DB::raw('COALESCE(SUM(IF(valorsistema IS NULL, 0, valorsistema)), 0) as total'))
            ->value('total');

        return (float) $total;
    }

    public function getHoraAttribute()
    {

        return $this->fechaapertura?->format('H:i') ?? null;
    }
}
