<?php

namespace App\Services\AsyncProcess\DTOs;

class JobDTO
{
    public function __construct(public string $service, public string $method, public array $parameters){}
}
