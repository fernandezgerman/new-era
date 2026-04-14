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
        $exists = DB::table('perfilfuncion')
            ->where('idperfil', 8)
            ->where('idfuncion', 133)
            ->exists();

        if (!$exists) {
            DB::table('perfilfuncion')->insert([
                'idperfil' => 8,
                'idfuncion' => 133,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the inserted record on rollback
        DB::table('perfilfuncion')
            ->where('idperfil', 8)
            ->where('idfuncion', 133)
            ->delete();
    }
};
