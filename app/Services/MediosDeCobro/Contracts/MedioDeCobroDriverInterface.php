<?php

namespace App\Services\MediosDeCobro\Contracts;

use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\DTOs\OrderDTO;

interface MedioDeCobroDriverInterface
{
    public function createOrder(OrderDTO $orderDTO): OrderDTO;

    public function testConnection(): bool;

}
