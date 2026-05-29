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
        Schema::create('importacion_proveedor_listas', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('idproveedor');
            $table->bigInteger('idarticulo')->nullable()->default(null);
            $table->string('campo1', 250)->nullable()->default(null);
            $table->string('campo2', 250)->nullable()->default(null);
            $table->string('campo3', 250)->nullable()->default(null);
            $table->string('campo4', 250)->nullable()->default(null);
            $table->string('campo5', 250)->nullable()->default(null);
            $table->string('campo6', 250)->nullable()->default(null);
            $table->string('campo7', 250)->nullable()->default(null);
            $table->string('campo8', 250)->nullable()->default(null);
            $table->string('campo9', 250)->nullable()->default(null);
            $table->string('campo10', 250)->nullable()->default(null);
            $table->string('campo11', 250)->nullable()->default(null);
            $table->json('descripcionproceso')->nullable()->default(null);
            $table->timestamps();

            $table->foreign('idproveedor')->references('id')->on('proveedores');
            $table->foreign('idarticulo')->references('id')->on('articulos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('importacion_proveedor_listas');
    }
};
