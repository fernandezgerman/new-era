<?php

namespace App\Services\MediosDeCobro\Database;
use Aws\DynamoDb\DynamoDbClient;
use Illuminate\Database\Migrations\Migration;

abstract class AbstractDynamoDBMigrationBase extends Migration
{
    protected DynamoDbClient $client;

    public function __construct()
    {
        $config = config('dynamodb.default');
        $this->client = new DynamoDbClient($config);

    }

    abstract public function up(): void;
}
