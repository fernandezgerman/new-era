<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('accesosporhora', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('horadesde',10)->nullable();
            $table->string('horahasta',10)->nullable();
            $table->string('accion', 20)->nullable(false);
            $table->string('diadelasemana', 80)->nullable();
            $table->date('fecha')->nullable();
            $table->string('targettype', 80)->nullable();
            $table->bigInteger('targetid')->nullable();
            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accesosporhora');
    }
};
