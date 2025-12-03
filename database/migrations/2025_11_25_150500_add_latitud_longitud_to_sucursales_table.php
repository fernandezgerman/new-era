<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sucursales', function (Blueprint $table) {
            // Using DECIMAL for consistent precision in queries and indexes
            $table->decimal('latitud', 10, 7)->nullable()->after('idlocalidad');
            $table->decimal('longitud', 10, 7)->nullable()->after('latitud');
            // Optionally add an index to speed up geospatial queries
            $table->index(['latitud', 'longitud'], 'sucursales_lat_lon_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sucursales', function (Blueprint $table) {
            $table->dropIndex('sucursales_lat_lon_idx');
            $table->dropColumn(['latitud', 'longitud']);
        });
    }
};
