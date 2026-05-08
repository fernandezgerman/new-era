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
        Schema::create('articulopreciohistorico', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idcabecera');
            $table->string('tipo')->nullable();
            $table->bigInteger('idarticulo');
            $table->bigInteger('idlista')->nullable();
            $table->json('oldvalues')->nullable();
            $table->json('newvalues')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('idarticulo')->references('id')->on('articulos');
            $table->foreign('idlista')->references('id')->on('listas');
            $table->foreign('idcabecera')->references('id')->on('preciohistorico');

            $table->index('idarticulo');
            $table->index('idlista');
            $table->index('idcabecera');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articulopreciohistorico');
    }
};
