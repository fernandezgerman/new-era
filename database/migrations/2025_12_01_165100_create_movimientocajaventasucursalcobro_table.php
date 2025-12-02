<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('movimientocajaventasucursalcobro', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('idmovimientocaja');
            $table->unsignedBigInteger('idventasucursalcobro');
            $table->timestamps();

            // Indexes
            $table->index('idmovimientocaja');
            $table->index('idventasucursalcobro');

            // Foreign keys
            $table->foreign('idmovimientocaja')
                ->references('id')
                ->on('movimientoscaja')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('idventasucursalcobro')
                ->references('id')
                ->on('ventasucursalcobros')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::table('movimientocajaventasucursalcobro', function (Blueprint $table) {
            $table->dropForeign(['idmovimientocaja']);
            $table->dropForeign(['idventasucursalcobro']);
            $table->dropIndex(['idmovimientocaja']);
            $table->dropIndex(['idventasucursalcobro']);
        });

        Schema::dropIfExists('movimientocajaventasucursalcobro');
    }
};
