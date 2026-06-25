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
            ->where('codigo', 'exis-sin-cmp')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'id' => 139,
                'idmodulo' => 12,
                'codigo' => 'exis-sin-cmp',
                'nombre' => 'Existencias sin compras',
                'pagina' => 'excmp.jsx',
                'activa' => 1,
                'observaciones' => 'Muestra las existencias sin compras',
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
            ->where('codigo', 'exis-sin-cmp')
            ->delete();
    }
};
