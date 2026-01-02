<?php

namespace App\Services\MediosDeCobro\Enums;

enum OrderPaymentChargeDetailTypeEnum: string
{
    case TAX = 'tax';
    case FEE = 'fee';
}
