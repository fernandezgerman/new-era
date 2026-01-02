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
        Schema::table('funciones', function (Blueprint $table) {
            if (!Schema::hasColumn('funciones', 'neweramenu')) {
                $table->boolean('neweramenu')->default(false)->after('menu');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('funciones', function (Blueprint $table) {
            if (Schema::hasColumn('funciones', 'neweramenu')) {
                $table->dropColumn('neweramenu');
            }
        });
    }
};
