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
        Schema::table('modosdecobro', function (Blueprint $table) {
            if (!Schema::hasColumn('modosdecobro', 'driver')) {
                $table->string('driver', 80)->nullable()->after('comision');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modosdecobro', function (Blueprint $table) {
            if (Schema::hasColumn('modosdecobro', 'driver')) {
                $table->dropColumn('driver');
            }
        });
    }
};
