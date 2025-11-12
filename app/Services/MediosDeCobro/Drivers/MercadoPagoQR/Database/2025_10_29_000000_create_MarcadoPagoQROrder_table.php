<?php

use App\Services\MediosDeCobro\Database\AbstractDynamoDBMigrationBase;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration{
    public function up(): void
    {
        Schema::create('mercadopagoqrorders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('ventasucursalcobroid')->unsigned();
            $table->string('externalorderid');
            $table->string('estado');
            $table->json('externalorderdata');
            $table->timestamps();

            $table->index('ventasucursalcobroid');
            $table->index('externalorderid');

            $table->foreign('ventasucursalcobroid')->references('id')->on('ventasucursalcobros')->cascadeOnDelete()->cascadeOnUpdate();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mercadopagoqrorders');
    }
};
