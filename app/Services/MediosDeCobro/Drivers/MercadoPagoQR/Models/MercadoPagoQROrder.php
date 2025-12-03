<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Models;
use Kitar\Dynamodb\Model\Model;

class MercadoPagoQROrder extends Model
{
    // Use the Laravel DB connection configured for DynamoDB
    protected $connection = 'dynamodb';

    // DynamoDB table name (can be overridden via env DYNAMODB_ORDERS_TABLE when using table prefixes in the connection)
    protected $table = 'MercadoPagoQROrder';

    // Partition (HASH) key name as created in the migration
    protected $primaryKey = 'order_id';

    // Optional: If you had a sort key you would define `$sortKey = '...'`

    protected $fillable = [
        'order_id',
        'external_order_id',
        'sucursal_id',
        'fecha_hora_venta',
        'venta_data',
        'pago_data',
        'estado',
    ];

    protected $casts = [
        'venta_data' => 'json',
        'pago_data' => 'json',
    ];
}
