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
        Schema::table('ventassucursal', function (Blueprint $table) {
            $table->string('costosucursalcriterio', 50)->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventassucursal', function (Blueprint $table) {
            $table->dropColumn('costosucursalcriterio');
        });
    }
};
