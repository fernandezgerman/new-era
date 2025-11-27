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
        Schema::table('mediodecobrosucursalconfiguraciones', function (Blueprint $table) {
            // boolean flag to mark if external configuration was checked/verified
            $table->boolean('configuration_checked')->default(false)->after('metadata');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mediodecobrosucursalconfiguraciones', function (Blueprint $table) {
            $table->dropColumn('configuration_checked');
        });
    }
};
