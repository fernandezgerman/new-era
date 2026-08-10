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
        // Insert the new modulo only if it does not already exist
        $exists = DB::table('modulos')
            ->where('descripcion', 'Tareas')
            ->exists();

        if (!$exists) {
            DB::table('modulos')->insert([
                'descripcion' => 'Tareas',
                'id' => 26,
                // Using the conventional column name 'observaciones'
                'observaciones' => 'Tareas generales',
                'icon' => 'tasks',
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('modulos')
            ->where('descripcion', 'Tareas')
            ->delete();
    }
};
