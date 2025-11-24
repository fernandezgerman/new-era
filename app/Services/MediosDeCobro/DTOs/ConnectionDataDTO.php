<?php

namespace App\Services\MediosDeCobro\DTOs;

use App\Models\ModoDeCobro;

class ConnectionDataDTO
{
    public string $host;

    public string $token;

    public ModoDeCobro $modoDeCobro;
}
