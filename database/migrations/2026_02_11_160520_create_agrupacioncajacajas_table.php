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
        Schema::create('agrupacioncajacajas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('idagrupacioncaja');
            $table->bigInteger('idsucursal');
            $table->bigInteger('idusuario');

            $table->foreign('idagrupacioncaja')
                ->references('id')->on('agrupacioncajas')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('idsucursal')
                ->references('id')->on('sucursales')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('idusuario')
                ->references('id')->on('usuarios')
                ->onUpdate('cascade')->onDelete('cascade');

            $table->index('idsucursal', 'agrupacioncajacajas_idsucursal_idx');
            $table->index('idusuario', 'agrupacioncajacajas_idusuario_idx');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agrupacioncajacajas');
    }
};
