<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('itemsinicio', function (Blueprint $column) {
            $column->tinyInteger('neweramenu')->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('itemsinicio', function (Blueprint $column) {
            $column->dropColumn('neweramenu');
        });
    }
};
