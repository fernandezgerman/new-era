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
        // Avoid duplicate insertions using unique codigo key guard
        $exists = DB::table('funciones')
            ->where('codigo', 'ctbblncgrl')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'id' => 142,
                'idmodulo' => 10,
                'codigo' => 'ctbblncgrl',
                'nombre' => 'Balance General',
                'pagina' => 'tblr.jsx',
                'activa' => 1,
                'observaciones' => 'Balance general',
                'menu' => 1,
                'neweramenu' => 1,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('funciones')
            ->where('codigo', 'ctbblncgrl')
            ->delete();
    }
};
