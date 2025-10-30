<?php

namespace App\Services\MediosDeCobro\Contracts;

use App\Services\MediosDeCobro\DTOs\OrderStatusChangeDTO;
use App\Services\MediosDeCobro\DTOs\WebhookEventDTO;

interface MedioDeCobroEventHandlerInterface
{
    public function processEvent(WebhookEventDTO $webhookEventDTO): ?OrderStatusChangeDTO;

}
