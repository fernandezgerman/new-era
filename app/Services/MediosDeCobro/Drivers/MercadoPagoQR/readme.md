Para obtener el detalle del pago:
1 - tomar el payment id:
{
"id": "ORDTST01KC220W64G2BQFHHEY1EN1ZZJ",
"type": "qr",
"processing_mode": "automatic",
"external_reference": "ID23",
"description": "Order QR - Sucursal 22",
"total_amount": "5200.00",
"total_paid_amount": "5200.00",
"expiration_time": "PT16M",
"country_code": "ARG",
"user_id": "3021033244",
"status": "processed",
"status_detail": "accredited",
"currency": "ARS",
"created_date": "2025-12-09T17:19:54.099Z",
"last_updated_date": "2025-12-09T17:20:18.363Z",
"integration_data": {
"application_id": "2734487936082990"
},
"config": {
"qr": {
"external_pos_id": "SUC22CAJA1",
"mode": "static"
}
},
"transactions": {
"payments": [
{
"id": "PAY01KC220W64G2BQFHHEY4M74MGJ",
"amount": "5200.00",
"paid_amount": "5200.00",
"reference_id": "137159042654",
"status": "processed",
"status_detail": "accredited",
"payment_method": {
"id": "visa",
"type": "credit_card",
"installments": 1
}
}
]
},
"items": [
{
"title": " Citric naranja 1lt",
"unit_price": "5200.00",
"unit_measure": "unit",
"external_code": "7798085681568",
"quantity": 1
}
]
}

2 - Luego consumir con ese id: https://api.mercadopago.com/v1/payments/:paymentId el response:
{
"accounts_info": null,
"acquirer_reconciliation": [],
"additional_info": {
"ip_address": "190.210.184.251",
"items": [
{
"description": "Order QR - Sucursal 22",
"quantity": "1",
"title": " Citric naranja 1lt",
"unit_price": "5200"
}
],
"tracking_id": "platform:v1-blacklabel,so:ALL,type:N/A,security:none"
},
"authorization_code": "301299",
"binary_mode": true,
"brand_id": null,
"build_version": "3.134.0-rc-1",
"call_for_authorize_id": null,
"captured": true,
"card": {
"bin": "45099535",
"cardholder": {
"identification": {
"number": "13287888",
"type": "DNI"
},
"name": "APRO"
},
"country": "ARG",
"date_created": "2025-12-09T13:20:17.000-04:00",
"date_last_updated": "2025-12-09T13:20:17.000-04:00",
"expiration_month": 11,
"expiration_year": 2030,
"first_six_digits": "450995",
"id": "9696779068",
"last_four_digits": "3704",
"tags": [
"credit"
]
},
"charges_details": [
{
"accounts": {
"from": "collector",
"to": "mp"
},
"amounts": {
"original": 395.72,
"refunded": 0
},
"base_amount": 5200,
"client_id": 0,
"date_created": "2025-12-09T13:20:17.000-04:00",
"external_charge_id": "01KC221K84RWK11EQAV667S2PK",
"id": "137159042654-001",
"last_updated": "2025-12-09T13:20:17.000-04:00",
"metadata": {
"reason": "",
"source": "proc-svc-charges",
"source_detail": "processing_fee_charge"
},
"name": "mercadopago_fee",
"rate": 7.61,
"refund_charges": [],
"reserve_id": null,
"type": "fee"
},
{
"accounts": {
"from": "collector",
"to": "mp"
},
"amounts": {
"original": 156,
"refunded": 0
},
"base_amount": 5200,
"client_id": 0,
"date_created": "2025-12-09T13:20:17.000-04:00",
"id": "137159042654-002",
"last_updated": "2025-12-09T13:20:17.000-04:00",
"metadata": {
"mov_detail": "tax_withholding_sirtac_noinsc",
"mov_financial_entity": "buenos_aires",
"mov_type": "expense",
"source": "taxes",
"source_detail": "",
"tax_id": 109601698496,
"tax_status": "applied",
"user_id": 3021033244
},
"name": "tax_withholding_sirtac_noinsc-buenos_aires",
"rate": 3,
"refund_charges": [],
"reserve_id": null,
"type": "tax"
}
],
"charges_execution_info": {
"internal_execution": {
"date": "2025-12-09T13:20:17.170-04:00",
"execution_id": "01KC221K76HGFW8TMVAF3ANGV1"
}
},
"collector_id": 3021033244,
"corporation_id": null,
"counter_currency": null,
"coupon_amount": 0,
"currency_id": "ARS",
"date_approved": "2025-12-09T13:20:17.000-04:00",
"date_created": "2025-12-09T13:20:17.000-04:00",
"date_last_updated": "2025-12-09T13:20:25.000-04:00",
"date_of_expiration": null,
"deduction_schema": null,
"description": "Order QR - Sucursal 22",
"differential_pricing_id": null,
"external_reference": "ID23",
"fee_details": [
{
"amount": 395.72,
"fee_payer": "collector",
"type": "mercadopago_fee"
}
],
"financing_group": null,
"id": 137159042654,
"installments": 1,
"integrator_id": null,
"issuer_id": "310",
"live_mode": true,
"marketplace_owner": null,
"merchant_account_id": null,
"merchant_number": null,
"metadata": {},
"money_release_date": "2025-12-09T13:20:17.000-04:00",
"money_release_schema": null,
"money_release_status": "released",
"notification_url": null,
"operation_type": "regular_payment",
"order": {
"id": "36246917291",
"type": "mercadopago"
},
"payer": {
"email": "test_user_3689489812670298154@testuser.com",
"entity_type": null,
"first_name": null,
"id": "2915257370",
"identification": {
"number": "1111111",
"type": "DNI"
},
"last_name": null,
"operator_id": null,
"phone": {
"number": null,
"extension": null,
"area_code": null
},
"type": null
},
"payment_method": {
"data": {
"routing_data": {
"merchant_account_id": "160"
}
},
"id": "visa",
"issuer_id": "310",
"type": "credit_card"
},
"payment_method_id": "visa",
"payment_type_id": "credit_card",
"platform_id": null,
"point_of_interaction": {
"application_data": {
"name": null,
"operating_system": null,
"version": null
},
"business_info": {
"branch": "QR",
"sub_unit": "qr",
"unit": "wallet"
},
"linked_to": "regular_payment",
"location": {
"source": "store",
"state_id": "AR-B"
},
"references": [
{
"id": "ORDTST01KC220W64G2BQFHHEY1EN1ZZJ",
"type": "ORDER_MP"
}
],
"sub_type": "INTRA_PSP",
"transaction_data": {
"bank_info": {
"collector": {
"account_alias": null,
"account_holder_name": null,
"account_id": null,
"long_name": null,
"transfer_account_id": null
},
"is_same_bank_account_owner": null,
"origin_bank_id": null,
"origin_wallet_id": null,
"payer": {
"account_id": null,
"branch": null,
"external_account_id": null,
"id": null,
"identification": {},
"is_end_consumer": null,
"long_name": null
}
},
"bank_transfer_id": null,
"e2e_id": null,
"financial_institution": null,
"infringement_notification": {
"status": null,
"type": null
},
"merchant_category_code": null,
"qr_code": null,
"ticket_url": null,
"transaction_id": null
},
"type": "INSTORE"
},
"pos_id": "122220915",
"processing_mode": "aggregator",
"refunds": [],
"release_info": null,
"shipping_amount": 0,
"sponsor_id": null,
"statement_descriptor": "Mercadopago*fake",
"status": "approved",
"status_detail": "accredited",
"store_id": "72054947",
"tags": null,
"taxes_amount": 0,
"transaction_amount": 5200,
"transaction_amount_refunded": 0,
"transaction_details": {
"acquirer_reference": null,
"external_resource_url": null,
"financial_institution": null,
"installment_amount": 5200,
"net_received_amount": 4648.28,
"overpaid_amount": 0,
"payable_deferral_period": null,
"payment_method_reference_id": null,
"total_paid_amount": 5200
}
}
