<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mediodecobrosucursalconfiguraciones', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->bigInteger('idsucursal');
            $table->bigInteger('idmododecobro');

            $table->boolean('habilitarconfiguracion')->default(false);
            $table->boolean('transferirmonto')->default(false);

            $table->bigInteger('idsucursalcajadestino')->nullable();
            $table->bigInteger('idusuariocajadestino')->nullable();

            $table->json('metadata')->nullable();

            $table->timestamps();

            // Indexes (use short names to avoid MySQL 64-char limit)
            $table->index('idsucursal', 'mdcsc_idsucursal_idx');
            $table->index('idmododecobro', 'mdcsc_idmododecobro_idx');
            $table->index('idsucursalcajadestino', 'mdcsc_idsuc_caja_dest_idx');
            $table->index('idusuariocajadestino', 'mdcsc_idusr_caja_dest_idx');

            // Unique constraint to ensure one configuration per sucursal + modo de cobro
            $table->unique(['idsucursal', 'idmododecobro'], 'mdcsc_sucursal_mododecobro_uniq');

            // Foreign keys (use short names to avoid MySQL 64-char limit)
            $table->foreign('idsucursal', 'mdcsc_idsucursal_fk')->references('id')->on('sucursales')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('idmododecobro', 'mdcsc_idmododecobro_fk')->references('id')->on('modosdecobro')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('idsucursalcajadestino', 'mdcsc_idsuc_caja_dest_fk')->references('id')->on('sucursales')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('idusuariocajadestino', 'mdcsc_idusr_caja_dest_fk')->references('id')->on('usuarios')->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mediodecobrosucursalconfiguraciones', function (Blueprint $table) {
            // Drop FKs by explicit names used in up()
            $table->dropForeign('mdcsc_idsucursal_fk');
            $table->dropForeign('mdcsc_idmododecobro_fk');
            $table->dropForeign('mdcsc_idsuc_caja_dest_fk');
            $table->dropForeign('mdcsc_idusr_caja_dest_fk');

            // Drop indexes by explicit names used in up()
            $table->dropIndex('mdcsc_idsucursal_idx');
            $table->dropIndex('mdcsc_idmododecobro_idx');
            $table->dropIndex('mdcsc_idsuc_caja_dest_idx');
            $table->dropIndex('mdcsc_idusr_caja_dest_idx');

            // Drop unique constraints by explicit names used in up()
            $table->dropUnique('mdcsc_sucursal_mododecobro_uniq');
        });

        Schema::dropIfExists('mediodecobrosucursalconfiguraciones');
    }
};
