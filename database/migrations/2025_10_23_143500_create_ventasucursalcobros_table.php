<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ventasucursalcobros', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('idusuario');
            $table->bigInteger('idsucursal');
            $table->bigInteger('idmododecobro')->nullable();
            $table->string('estado', 30)->nullable();
            $table->decimal('importe', 20, 3)->default(0);
            $table->timestamps();

            // Indexes for faster joins
            $table->index('idusuario');
            $table->index('idsucursal');
            $table->index('idmododecobro');

            // Foreign keys
            $table->foreign('idusuario')->references('id')->on('usuarios')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('idsucursal')->references('id')->on('sucursales')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('idmododecobro')->references('id')->on('modosdecobro')->restrictOnDelete()->cascadeOnUpdate();

        });
    }

    public function down(): void
    {
        Schema::table('ventasucursalcobros', function (Blueprint $table) {
            $table->dropForeign(['idusuario']);
            $table->dropForeign(['idsucursal']);
            $table->dropForeign(['idmododecobro']);
            $table->dropIndex(['idusuario']);
            $table->dropIndex(['idsucursal']);
            $table->dropIndex(['idmododecobro']);
        });
        Schema::dropIfExists('ventasucursalcobros');
    }
};
