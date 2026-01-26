<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs;

class MercadoPagoOrderResponseDTO
{
    public string $id;
    public string $user_id;
    public string $type;
    public ?string $external_reference = null;
    public ?string $description = null;
    public ?string $expiration_time = null;
    public ?string $processing_mode = null;
    public ?string $total_amount = null;
    public ?string $country_code = null;
    public ?string $marketplace_fee = null;
    public ?string $status = null;
    public ?string $status_detail = null;
    public ?string $created_date = null;
    public ?string $last_updated_date = null;

    public ?MPOrderConfigQRDTO $config_qr = null;
    public ?MPOrderTransactionsDTO $transactions = null;
    /** @var MPOrderTaxDTO[] */
    public array $taxes = [];
    /** @var MPOrderItemDTO[] */
    public array $items = [];
    /** @var MPRefund[] */
    public array $refunds = [];
    public ?MPOrderDiscountsDTO $discounts = null;
    public ?MPTypeResponseDTO $type_response = null;
}
