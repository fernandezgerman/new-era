<?php

namespace App\Services\MediosDeCobro\Contracts;

use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\DTOs\OrderPaymentDetailDTO;

interface MedioDeCobroDriverInterface
{
    public function createOrder(OrderDTO $orderDTO): OrderDTO;

    public function getOrder(string $localId): OrderDTO;

    public function refundOrder(string $localId): OrderDTO;

    public function testConnection(int $sucursalId): bool;

    public function syncPaymentDetails(OrderDTO $orderDTO): OrderPaymentDetailDTO;
}
