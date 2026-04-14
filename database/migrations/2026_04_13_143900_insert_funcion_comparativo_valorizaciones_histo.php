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
            ->where('codigo', 'vlrs_histo')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'id' => 133,
                'idmodulo' => 10,
                'codigo' => 'vlrs_histo',
                'nombre' => 'Valorizacion historico',
                'pagina' => 'valorizacionesHistorico.jsx',
                'activa' => 1,
                'observaciones' => 'Muestra el hisorico de las valorizaciones en grafico',
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
            ->where('codigo', 'vlrs_histo')
            ->delete();
    }
};
