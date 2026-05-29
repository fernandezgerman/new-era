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
            ->where('codigo', 'imp-prov-listas')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'idmodulo' => 16,
                'codigo' => 'imp-prov-listas',
                'nombre' => 'Importar listas',
                'pagina' => 'ProveedoresListasImportar.jsx',
                'activa' => 1,
                'observaciones' => 'Importar listas de rpeciosd e proveedores',
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
            ->where('codigo', 'imp-prov-listas')
            ->delete();
    }
};
