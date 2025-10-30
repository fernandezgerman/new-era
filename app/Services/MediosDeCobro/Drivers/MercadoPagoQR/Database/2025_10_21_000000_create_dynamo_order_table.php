<?php

use App\Services\MediosDeCobro\Database\AbstractDynamoDBMigrationBase;

return new class extends AbstractDynamoDBMigrationBase {
    public function up(): void
    {
        //No es momento para lidirar con DYNAMO, nos vemos en mysql :(
        exit;
        $tableName = env('DYNAMODB_ORDERS_TABLE', 'MercadoPagoQROrder');

        $existing = $this->client->listTables();
        if (in_array($tableName, $existing['TableNames'] ?? [])) {
            return; // table already exists
        }

        $this->client->createTable([
            'TableName' => $tableName,
            'AttributeDefinitions' => [
                ['AttributeName' => 'order_id', 'AttributeType' => 'S'],
                ['AttributeName' => 'sucursal_id', 'AttributeType' => 'S'],
                ['AttributeName' => 'fecha_hora_venta', 'AttributeType' => 'N'],
            ],
            'KeySchema' => [
                ['AttributeName' => 'order_id', 'KeyType' => 'HASH'],
            ],
            'GlobalSecondaryIndexes' => [
                [
                    'IndexName' => 'idsucursal_fechahoraventa_index',
                    'KeySchema' => [
                        ['AttributeName' => 'sucursal_id', 'KeyType' => 'HASH'],
                        ['AttributeName' => 'fecha_hora_venta', 'KeyType' => 'RANGE'],
                    ],
                    'Projection' => ['ProjectionType' => 'ALL'],
                    'ProvisionedThroughput' => [
                        'ReadCapacityUnits' => 5,
                        'WriteCapacityUnits' => 5,
                    ],
                ],
            ],
            'BillingMode' => 'PROVISIONED',
            'ProvisionedThroughput' => [
                'ReadCapacityUnits' => 5,
                'WriteCapacityUnits' => 5,
            ],
        ]);

        // wait until table is active
        $this->client->waitUntil('TableExists', ['TableName' => $tableName]);
    }

    public function down(): void
    {

            exit;
        $tableName = env('DYNAMODB_ORDERS_TABLE', 'MercadoPagoQROrder');

        $existing = $this->client->listTables();
        if (! in_array($tableName, $existing['TableNames'] ?? [])) {
            return; // nothing to drop
        }

        $this->client->deleteTable(['TableName' => $tableName]);
        $this->client->waitUntil('TableNotExists', ['TableName' => $tableName]);
    }
};
