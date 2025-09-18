<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert the alert type if it does not exist
        $exists = DB::table('alertastipos')
            ->where('codigo', 'Solicitudes pago')
            ->exists();

        if (!$exists) {
            DB::table('alertastipos')->insert([
                'nombre' => ' Solicitudes de pago',
                'codigo' => 'Solicitudes de pago',
                // 'bloqueante' can be null; leaving it out lets DB default apply
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the inserted alert type
        DB::table('alertastipos')
            ->where('codigo', 'Solicitudes pago')
            ->delete();
    }
};
