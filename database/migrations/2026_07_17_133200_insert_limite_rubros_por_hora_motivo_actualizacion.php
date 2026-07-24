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
        DB::table('motivosactualizaciones')->insert([
            'id'               => 33,
            'codigo'           => 'GET-LMT-RBR-HR',
            'nombre'           => 'Rubros por hora',
            'descripcion'      => 'Limita la venta de rubros a una hora',
            'maximocola'       => 0,
            'maximaespera'     => 10,
            'cierreautomatico' => 1,
            'orden'            => 0,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('motivosactualizaciones')->where('id', 33)->delete();
    }
};
