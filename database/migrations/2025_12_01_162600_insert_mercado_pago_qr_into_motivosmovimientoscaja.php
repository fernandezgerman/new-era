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
        // Avoid duplicate inserts if migration is re-run or data already exists
        $exists = DB::table('motivosmovimientoscaja')
            ->where('descripcion', 'Mercado Pago QR')
            ->exists();

        if (! $exists) {
            DB::table('motivosmovimientoscaja')->insert([
                'id' => 17,
                'descripcion' => 'Mercado Pago QR',
                'requiereaprobacion' => 1,
                'activo' => 1,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('motivosmovimientoscaja')
            ->where('descripcion', 'Mercado Pago QR')
            ->delete();
    }
};
