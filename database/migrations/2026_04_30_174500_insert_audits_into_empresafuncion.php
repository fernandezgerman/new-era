<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        DB::table('empresafuncion')->insert([
            'idempresa' => 2,
            'idfuncion' => 134,
            'activo' => 1,
        ]);

        DB::table('empresafuncion')->insert([
            'idempresa' => 6,
            'idfuncion' => 134,
            'activo' => 1,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the inserted record on rollback
        DB::table('empresafuncion')
            ->where('idempresa', 2)
            ->where('idfuncion', 134)
            ->delete();
    }
};
