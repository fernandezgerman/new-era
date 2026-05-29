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
        Schema::create('proveedorlistas', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('idproveedor');
            $table->bigInteger('idusuario');
            $table->date('fechalista');
            $table->json('config')->nullable();
            $table->timestamps();

            $table->foreign('idproveedor')->references('id')->on('proveedores');
            $table->foreign('idusuario')->references('id')->on('usuarios');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedorlistas');
    }
};
