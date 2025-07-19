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
        Schema::table('liquidaciondetalleconceptos', function (Blueprint $table) {
            $table->decimal('importe', 30, 3)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('liquidaciondetalleconceptos', function (Blueprint $table) {
            $table->decimal('importe', 10, 3)->change();
        });
    }
};
