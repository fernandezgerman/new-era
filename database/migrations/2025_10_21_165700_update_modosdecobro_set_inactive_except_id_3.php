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
        // Set activo = 0 for all records where id is not 3
        DB::table('modosdecobro')
            ->where('id', '<>', 3)
            ->update(['activo' => 0]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Best effort rollback: cannot know prior values for 'activo'.
        // No-op to avoid corrupting data. Adjust manually if needed.
    }
};
