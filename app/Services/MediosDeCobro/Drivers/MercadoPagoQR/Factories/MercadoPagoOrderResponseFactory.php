<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories;

use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\{MPOrderConfigQRDTO, MPOrderDiscountsDTO, MPOrderItemDTO, MPOrderPaymentDTO, MPOrderTaxDTO, MPOrderTransactionsDTO, MPTypeResponseDTO, MercadoPagoOrderResponseDTO};
use Illuminate\Support\Arr;

class MercadoPagoOrderResponseFactory
{
    public static function fromArray(array $data): MercadoPagoOrderResponseDTO
    {
        $dto = new MercadoPagoOrderResponseDTO();
        $dto->id = (string) Arr::get($data, 'id');
        $dto->user_id = (string) Arr::get($data, 'user_id');
        $dto->type = (string) Arr::get($data, 'type');
        $dto->external_reference = Arr::get($data, 'external_reference');
        $dto->description = Arr::get($data, 'description');
        $dto->expiration_time = Arr::get($data, 'expiration_time');
        $dto->processing_mode = Arr::get($data, 'processing_mode');
        $dto->total_amount = Arr::get($data, 'total_amount');
        $dto->country_code = Arr::get($data, 'country_code');
        $dto->marketplace_fee = Arr::get($data, 'marketplace_fee');
        $dto->status = Arr::get($data, 'status');
        $dto->status_detail = Arr::get($data, 'status_detail');
        $dto->created_date = Arr::get($data, 'created_date');
        $dto->last_updated_date = Arr::get($data, 'last_updated_date');

        // config.qr
        $configQr = new MPOrderConfigQRDTO();
        $configQr->external_pos_id = Arr::get($data, 'config.qr.external_pos_id');
        $configQr->mode = Arr::get($data, 'config.qr.mode');
        $dto->config_qr = $configQr;

        // transactions.payments
        $transactions = new MPOrderTransactionsDTO();
        foreach ((array) Arr::get($data, 'transactions.payments', []) as $payment) {
            $p = new MPOrderPaymentDTO();
            $p->id = Arr::get($payment, 'id');
            $p->amount = Arr::get($payment, 'amount');
            $p->status = Arr::get($payment, 'status');
            $p->reference_id = Arr::get($payment, 'reference_id');
            $p->status_detail = Arr::get($payment, 'status_detail');
            $transactions->payments[] = $p;
        }
        $dto->transactions = $transactions;

        // taxes
        foreach ((array) Arr::get($data, 'taxes', []) as $tax) {
            $t = new MPOrderTaxDTO();
            $t->payer_condition = Arr::get($tax, 'payer_condition');
            $dto->taxes[] = $t;
        }

        // items
        foreach ((array) Arr::get($data, 'items', []) as $item) {
            $i = new MPOrderItemDTO();
            $i->title = Arr::get($item, 'title');
            $i->unit_price = Arr::get($item, 'unit_price');
            $i->quantity = Arr::get($item, 'quantity');
            $i->unit_measure = Arr::get($item, 'unit_measure');
            $i->external_code = Arr::get($item, 'external_code');
            $i->external_categories = Arr::get($item, 'external_categories');
            $dto->items[] = $i;
        }

        // discounts
        $discounts = new MPOrderDiscountsDTO();
        $discounts->payment_methods = (array) Arr::get($data, 'discounts.payment_methods', []);
        $dto->discounts = $discounts;

        // type_response
        $typeResponse = new MPTypeResponseDTO();
        $typeResponse->qr_data = Arr::get($data, 'type_response.qr_data');
        $dto->type_response = $typeResponse;

        return $dto;
    }
}
