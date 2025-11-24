<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Sucursal extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'sucursales';

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
        'nombre',
        'descripcion',
        'direccion',
        'telefono',
        'telefono2',
        'email',
        'codigopostal',
        'idempresa',
        'fechacreacion',
        'fechamodificacion',
        'activo',
        'idlista',
        'idprovincia',
        'idlocalidad',
        'modificarlistaporhora',
        'idsupervisor',
        'valorizacion',
        'valorizacionrubros',
        'valoriza',
        'aumentaenferiados',
        'idlistaferiados',
        'versionapp',
        'codigonobleza',
        'restingirarqueo',
        'restringirarqueohora',
        'restringirarqueoduracion',
        'restringirarqueoperfilpermitido',
        'restringirarqueodiasexcepcion',
        'restringirarqueoperfilexcepcion',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the empresa that owns the sucursal.
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'idempresa');
    }

    /**
     * Get the lista that owns the sucursal.
     */
    public function lista()
    {
        return $this->belongsTo(Lista::class, 'idlista');
    }

    /**
     * Get the provincia that owns the sucursal.
     */
    public function provincia()
    {
        return $this->belongsTo(Provincia::class, 'idprovincia');
    }

    /**
     * Get the localidad that owns the sucursal.
     */
    public function localidad()
    {
        return $this->belongsTo(Localidad::class, 'idlocalidad');
    }

    /**
     * Get the supervisor that owns the sucursal.
     */
    public function supervisor()
    {
        return $this->belongsTo(User::class, 'idsupervisor');
    }

    /**
     * Get the lista de feriados that owns the sucursal.
     */
    public function listaFeriados()
    {
        return $this->belongsTo(ListaFeriados::class, 'idlistaferiados');
    }

    /**
     * Get the usuarios for the sucursal.
     */
    public function usuarios()
    {
        return $this->belongsToMany(User::class, 'usuariossucursales', 'idsucursal', 'idusuario')
                    ->wherePivot('activo', true)
                    ->wherePivot('usuarios.activo', true)
                    ->withPivot('activo');
    }

    public function usuariosCajas()
    {
        return $this->belongsToMany(User::class, 'usuariossucursalescajas', 'idsucursal', 'idusuario')
            ->wherePivot('activo', true)
            ->wherePivot('usuarios.activo', true)
            ->withPivot('activo')
            ->orderBy(db::raw('concat(usuarios.nombre, usuarios.apellido)'));
    }

    /**
     * Compras asociadas a esta sucursal (sucursal de la operación)
     */
    public function compras()
    {
        return $this->hasMany(Compra::class, 'idsucursal');
    }

    /**
     * Compras registradas en caja en esta sucursal (idsucursalcaja)
     */
    public function comprasCaja()
    {
        return $this->hasMany(Compra::class, 'idsucursalcaja');
    }
}
