<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Skip if column already exists
        if (Schema::hasColumn('movimientoscaja', 'id')) {
            return;
        }

        $database = DB::getDatabaseName();

        // Detect if the table already has a PRIMARY KEY
        $hasPrimaryKey = false;
        $pkCheckSql = "SELECT COUNT(1) as cnt
                        FROM information_schema.table_constraints
                        WHERE table_schema = ? AND table_name = 'movimientoscaja' AND constraint_type = 'PRIMARY KEY'";
        $result = DB::select($pkCheckSql, [$database]);
        if ($result && ((int) ($result[0]->cnt ?? 0)) > 0) {
            $hasPrimaryKey = true;
        }

        if ($hasPrimaryKey) {
            // Table already has a PK: add AUTO_INCREMENT column with a UNIQUE index
            // MySQL will auto-fill existing rows when adding an AUTO_INCREMENT NOT NULL column
            DB::statement("ALTER TABLE `movimientoscaja` ADD COLUMN `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, ADD UNIQUE KEY `movimientoscaja_id_unique` (`id`)");
        } else {
            // No PK present: make the new column the PRIMARY KEY
            DB::statement("ALTER TABLE `movimientoscaja` ADD COLUMN `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY");
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('movimientoscaja', 'id')) {
            return;
        }

        // Drop the unique index if we created it
        try {
            // Check if the index exists
            $database = DB::getDatabaseName();
            $idxExists = DB::select(
                "SELECT COUNT(1) as cnt FROM information_schema.statistics WHERE table_schema = ? AND table_name = 'movimientoscaja' AND index_name = 'movimientoscaja_id_unique'",
                [$database]
            );
            if ($idxExists && ((int) ($idxExists[0]->cnt ?? 0)) > 0) {
                DB::statement("ALTER TABLE `movimientoscaja` DROP INDEX `movimientoscaja_id_unique`");
            }
        } catch (Throwable $e) {
            // ignore, best-effort
        }

        // Dropping the column will also drop PK if it was set as such by this migration
        DB::statement("ALTER TABLE `movimientoscaja` DROP COLUMN `id`");
    }
};
