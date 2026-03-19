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
            ->where('codigo', 'cnf-accs-hra')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'id' => 131,
                'idmodulo' => 20,
                'codigo' => 'cnf-accs-hra',
                'nombre' => 'Accesos al sistema',
                'pagina' => 'accesosPorHora.jsx',
                'activa' => 1,
                'observaciones' => 'Configura el acceso al sistema por hora',
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
            ->where('codigo', 'cnf-accs-hra')
            ->delete();
    }
};
