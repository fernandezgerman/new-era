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
        DB::table('motivosmovimientoscaja')
            ->where('id', 17)
            ->update([
                'descripcion' => 'Mercado Pago POINT',
            ]);
    }

    /**
     * Reverse the migrations.
     *
     * Note: previous value is unknown, so this is a no-op.
     */
    public function down(): void
    {
        // Intentionally left blank — previous value is unknown.
    }
};
