<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert the requested record into perfilfuncion if it doesn't already exist
        $exists = DB::table('modosdecobro')
            ->where('id', 4)
            ->exists();

        if (!$exists) {
            DB::table('modosdecobro')->insert([
                'id' => 4,
                'nombre' => "Mercado Pago Point",
                'fechahora' => Carbon::now()->format('Y-m-d H:i:s'),
                'idusuarioaudito' => 1,
                'activo' => 1,
                'driver' => 'MercadoPagoPoint'
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the inserted record on rollback
        DB::table('modosdecobro')
            ->where('id', 4)
            ->delete();
    }
};
