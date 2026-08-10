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
            ->where('codigo', 'tbltsk')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'id' => 141,
                'idmodulo' => 26,
                'codigo' => 'tbltsk',
                'nombre' => 'Tablero',
                'pagina' => 'tblr.jsx',
                'activa' => 1,
                'observaciones' => 'Muestra el dashboard',
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
            ->where('codigo', 'tbltsk')
            ->delete();
    }
};
