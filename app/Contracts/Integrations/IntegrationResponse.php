<?php

namespace App\Contracts\Integrations;

interface IntegrationResponse
{
    public function getData(): array;

    public function getErrors(): array;

    public function getIsValid(): bool;

    public function getStatus(): int;
}
