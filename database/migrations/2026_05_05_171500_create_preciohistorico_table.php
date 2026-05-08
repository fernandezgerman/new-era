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
        Schema::create('preciohistorico', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('idusuario');
            $table->string('status');
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('idusuario')->references('id')->on('usuarios');
            $table->index('idusuario');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preciohistorico');
    }
};
