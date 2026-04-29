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
        Schema::create('jobs_log', function (Blueprint $table) {
            $table->id();
            $table->string('method', 100);
            $table->string('service', 200);
            $table->string('status', 200);
            $table->string('description', 200)->nullable();
            $table->json('parametters');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs_log');
    }
};
