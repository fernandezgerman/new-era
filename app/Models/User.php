<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'usuarios';

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
        'apellido',
        'usuario',
        'clave',
        'email',
        'activo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'clave',
        'remember_token',
    ];

    /**
     * The column name for the "username" used for authentication.
     *
     * @var string
     */
    public function username()
    {
        return 'usuario';
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->clave;
    }

    /**
     * Get the sucursales for the user.
     */
    public function sucursales()
    {
        return $this->belongsToMany(Sucursal::class, 'usuariossucursales', 'idusuario', 'idsucursal')
                    ->where('sucursales.activo', 1)
                    ->where('usuariossucursales.activo', 1);
    }

    public function sucursalesCaja()
    {
        return $this->belongsToMany(Sucursal::class, 'usuariossucursalescajas', 'idusuario', 'idsucursal')
            ->where('sucursales.activo', 1)
            ->where('usuariossucursalescajas.activo', 1);
    }

    /**
     * Get the sucursales supervised by the user.
     */
    public function sucursalesSupervised()
    {
        return $this->hasMany(Sucursal::class, 'idsupervisor');
    }

    /**
     * Compras realizadas por este usuario (operador)
     */
    public function compras()
    {
        return $this->hasMany(Compra::class, 'idusuario');
    }

    /**
     * Compras registradas por este usuario de caja (idusuariocaja)
     */
    public function comprasCaja()
    {
        return $this->hasMany(Compra::class, 'idusuariocaja');
    }

    /**
     * Get the empresa that the user belongs to.
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'idempresa');
    }

    /**
     * Get the perfil that the user belongs to.
     */
    public function perfil()
    {
        return $this->belongsTo(Perfil::class, 'idperfil');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }
}
