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
            ->where('codigo', 'info-mpqr')
            ->exists();

        if (!$exists) {
            DB::table('funciones')->insert([
                'idmodulo' => 25,
                'codigo' => 'info-mpqr',
                'nombre' => 'Mercado Pago QR',
                'pagina' => 'mercadopagoqr.jsx',
                'activa' => 1,
                'observaciones' => 'Configuraciond e mercado pago QR',
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
            ->where('codigo', 'info-mpqr')
            ->delete();
    }
};
