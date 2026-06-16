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
            ->where('codigo', 'ord-cmp-2')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'id' => 137,
                'idmodulo' => 16,
                'codigo' => 'ord-cmp-2',
                'nombre' => 'Ordenes compra 2',
                'pagina' => 'ordenesDeCompra2.jsx',
                'activa' => 1,
                'observaciones' => 'Nueva pantalla de ordenes de compra',
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
            ->where('codigo', 'ord-cmp-2')
            ->delete();
    }
};
