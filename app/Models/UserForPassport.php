<?php

namespace App\Models;

use Admin9\OidcServer\Concerns\HasOidcClaims;
use Admin9\OidcServer\Contracts\OidcUserInterface;
use Laravel\Passport\HasApiTokens;

class UserForPassport extends AbstractUser implements OidcUserInterface
{
    use HasApiTokens, HasOidcClaims;


    public function getOidcSubject(): string
{
    return (string) $this->getKey(); // normalmente $this->id
}

    public function getOidcClaims(array $scopes): array
{
    $claims = [
        'sub' => $this->getOidcSubject(),
        "groups"=> $this->id === 1 ? ['planka-admin'] : ['boardUser']
    ];

    // Scope: profile
    $claims['name'] = $this->nombre ?? $this->usuario ?? '';
    $claims['preferred_username'] = $this->usuario ?? '';
    $claims['email'] = (($this->usuario) . '@newerakioscos.com');
    $claims['email_verified'] = true;


    return $claims;
}
}
