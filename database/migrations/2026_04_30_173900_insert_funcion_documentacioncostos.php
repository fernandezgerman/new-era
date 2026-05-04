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
            ->where('codigo', 'info-proc-costos')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'id' => 134,
                'idmodulo' => 25,
                'codigo' => 'info-proc-costos',
                'nombre' => 'Procesamiento de costos',
                'pagina' => 'procesamientodecostos.jsx',
                'activa' => 1,
                'observaciones' => 'Documentacion de calculo de costos',
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
            ->where('codigo', 'info-proc-costos')
            ->delete();
    }
};
