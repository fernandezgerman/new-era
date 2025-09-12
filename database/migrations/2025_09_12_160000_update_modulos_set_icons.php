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
        // Map of modulo id => icon value
        $map = [
            3 => 'server',
            7 => 'suitcase',
            9 => 'infinity',
            10 => 'money-check',
            11 => 'code',
            12 => 'layer-group',
            13 => 'file',
            14 => 'box-archive',
            15 => 'bug',
            16 => 'file-lines',
            17 => 'magnifying-glass',
            18 => 'money-bill-wave',
            20 => 'gears',
            21 => 'receipt',
            22 => 'bell',
            23 => 'cash-register',
            24 => 'money-bill',
        ];

        DB::transaction(function () use ($map) {
            foreach ($map as $id => $icon) {
                DB::table('modulos')->where('id', $id)->update(['icon' => $icon]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // On rollback, set the icons back to null for the affected ids only (if column allows nulls).
        // If the column is non-nullable, we leave as-is to avoid errors.
        // Attempt to set null safely; if it fails in runtime due to NOT NULL, dev can ignore.
        try {
            $ids = [3,7,9,10,11,12,13,14,15,16,17,18,20,21,22,23,24];
            DB::table('modulos')->whereIn('id', $ids)->update(['icon' => null]);
        } catch (\Throwable $e) {
            // no-op: keep values in place if column is non-nullable
        }
    }
};
