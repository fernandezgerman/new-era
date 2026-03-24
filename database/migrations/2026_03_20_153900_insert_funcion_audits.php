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
            ->where('codigo', 'audits')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'id' => 132,
                'idmodulo' => 17,
                'codigo' => 'audits',
                'nombre' => 'Auditar usuario',
                'pagina' => 'audicionUsuario.jsx',
                'activa' => 1,
                'observaciones' => 'Consulta de acciones de un usuario',
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
