<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('funciones')->where('codigo', 'lstdvnsctacte')->update(['activa' => 0]);
        DB::table('funciones')->where('codigo', 'lstorpglst')->update(['activa' => 0]);

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('funciones')->where('codigo', 'lstdvnsctacte')->update(['activa' => 1]);
        DB::table('funciones')->where('codigo', 'lstorpglst')->update(['activa' => 1]);
    }
};
