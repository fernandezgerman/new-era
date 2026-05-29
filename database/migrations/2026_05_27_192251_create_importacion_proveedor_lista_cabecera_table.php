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
        Schema::create('importacion_proveedor_lista_cabecera', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('idusuario');
            $table->string('estado', 80);
            $table->timestamps();

            $table->foreign('idusuario')->references('id')->on('usuarios');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('importacion_proveedor_lista_cabecera');
    }
};
