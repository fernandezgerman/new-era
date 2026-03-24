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
        // Insert the requested record into perfilfuncion if it doesn't already exist
        $exists = DB::table('empresafuncion')
            ->where('idempresa', 2)
            ->where('idfuncion', 132)
            ->exists();

        if (!$exists) {
            DB::table('empresafuncion')->insert([
                'idempresa' => 2,
                'idfuncion' => 132,
                'activo' => 1,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the inserted record on rollback
        DB::table('empresafuncion')
            ->where('idempresa', 2)
            ->where('idfuncion', 132)
            ->delete();
    }
};
