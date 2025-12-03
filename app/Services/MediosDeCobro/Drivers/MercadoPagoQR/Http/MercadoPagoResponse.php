<?php
namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Http;

use App\Contracts\Integrations\IntegrationResponse;

class MercadoPagoResponse implements IntegrationResponse
{
    private array $data;
    private array $errors;
    private bool $isValid;
    private int $status;

    public function __construct(int $status = 200, array $data = [], array $errors = [], bool $isValid = true)
    {
        $this->status = $status;
        $this->data = $data;
        $this->errors = $errors;
        $this->isValid = $isValid;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getIsValid(): bool
    {
        return $this->isValid;
    }

    public function getStatus(): int
    {
        return $this->status;
    }
}
