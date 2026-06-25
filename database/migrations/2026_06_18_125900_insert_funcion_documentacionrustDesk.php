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
            ->where('codigo', 'info-rust-desk')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'id' => 138,
                'idmodulo' => 25,
                'codigo' => 'info-rust-desk',
                'nombre' => 'Rust Desk',
                'pagina' => 'reustdesk.jsx',
                'activa' => 1,
                'observaciones' => 'Instalacion de acceso a sucursales',
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
            ->where('codigo', 'info-rust-desk')
            ->delete();
    }
};
