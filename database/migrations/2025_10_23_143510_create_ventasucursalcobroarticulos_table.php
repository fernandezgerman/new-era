<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ventasucursalcobroarticulos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('idventasucursalcobro');
            $table->bigInteger('idarticulo');
            $table->decimal('cantidad', 20, 3)->default(0);
            $table->decimal('importe', 20, 3)->default(0);
            $table->string('idunicoventa', 100);
            $table->timestamps();

            // Indexes
            $table->index('idventasucursalcobro', 'vsc_art_idx_cobro');
            $table->index('idarticulo', 'vsc_art_idx_articulo');

            // Foreign keys
            $table->foreign('idventasucursalcobro', 'vsc_art_fk_cobro')
                ->references('id')->on('ventasucursalcobros')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('idarticulo', 'vsc_art_fk_articulo')
                ->references('id')->on('articulos')
                ->restrictOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::table('ventasucursalcobroarticulos', function (Blueprint $table) {
            $table->dropForeign('vsc_art_fk_cobro');
            $table->dropForeign('vsc_art_fk_articulo');
            $table->dropIndex('vsc_art_idx_cobro');
            $table->dropIndex('vsc_art_idx_articulo');
        });
        Schema::dropIfExists('ventasucursalcobroarticulos');
    }
};
