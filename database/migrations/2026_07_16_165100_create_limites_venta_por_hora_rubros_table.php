<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\ForeignKeyDefinition;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('limites_venta_por_hora_rubros', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('idrubro')->unique();
            $table->integer('horadesde');
            $table->integer('horas');
            $table->boolean('activo')->default(true);

            $table->foreign('idrubro')->references('id')->on('rubros')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('limites_venta_por_hora_rubros');
    }
};
