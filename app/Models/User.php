<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Empresa;
use App\Models\Perfil;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

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
                    ->withPivot('activo')
                    ->withTimestamps();
    }

    /**
     * Get the sucursales supervised by the user.
     */
    public function sucursalesSupervised()
    {
        return $this->hasMany(Sucursal::class, 'idsupervisor');
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
