<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cobrosucursalgastos', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('idcompra')->unique();
            $table->unsignedBigInteger('idventasucursalcobro');
            $table->timestamps();

            $table->foreign('idcompra')->references('id')->on('compras')->cascadeOnDelete();
            $table->foreign('idventasucursalcobro')->references('id')->on('ventasucursalcobros')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cobrosucursalgastos');
    }
};
