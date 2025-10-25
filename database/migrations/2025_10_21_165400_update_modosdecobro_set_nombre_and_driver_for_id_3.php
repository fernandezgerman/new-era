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
        // Update id=3 to required values
        DB::table('modosdecobro')
            ->where('id', 3)
            ->update([
                'nombre' => 'Mercado Pago QR',
                'driver' => 'MercadoPagoQR',
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Best-effort rollback: we cannot know prior values with certainty.
        // If you want to be safe, adjust the values below to your previous data.
        // Here we keep 'driver' null and leave 'nombre' unchanged to avoid data loss.
        DB::table('modosdecobro')
            ->where('id', 3)
            ->update([
                'driver' => null,
            ]);
    }
};
