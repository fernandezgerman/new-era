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
        Schema::create('proveedorlistadetalle', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idproveedorlista');
            $table->bigInteger('idarticulo');
            $table->string('descripciondelproveedor', 250);
            $table->decimal('precio', 20, 2);
            $table->timestamps();

            $table->foreign('idproveedorlista')->references('id')->on('proveedorlistas')->onDelete('cascade');
            $table->foreign('idarticulo')->references('id')->on('articulos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedorlistadetalle');
    }
};
