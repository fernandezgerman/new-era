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
            ->where('codigo', 'edt-gst')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'id' => 140,
                'idmodulo' => 18,
                'codigo' => 'edt-gst',
                'nombre' => 'Editar gastos',
                'pagina' => 'nada.jsx',
                'activa' => 1,
                'observaciones' => 'Edicion de gastos',
                'menu' => 0,
                'neweramenu' => 0,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('funciones')
            ->where('codigo', 'edt-gst')
            ->delete();
    }
};
