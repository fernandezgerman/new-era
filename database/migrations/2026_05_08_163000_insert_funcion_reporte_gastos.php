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
            ->where('codigo', 'rep-gastos')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'idmodulo' => 18,
                'codigo' => 'rep-gastos',
                'nombre' => 'Reporte de gastos',
                'pagina' => 'reporteGastos.jsx',
                'activa' => 1,
                'observaciones' => 'Visualización de reportes de gastos',
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
            ->where('codigo', 'rep-gastos')
            ->delete();
    }
};
