<?php

namespace App\Models;

use Admin9\OidcServer\Concerns\HasOidcClaims;
use Admin9\OidcServer\Contracts\OidcUserInterface;
use App\Services\Actualizaciones\Contracts\ActualizableItem;
use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;
use App\Services\Actualizaciones\Enums\CodigoMotivoActualizacion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Passport\HasApiTokens as PassportHasApiTokens;

class User extends AbstractUser implements ActualizableItem
{

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasOidcClaims;

}
