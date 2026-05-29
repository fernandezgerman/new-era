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
        Schema::table('importacion_proveedor_listas', function (Blueprint $table) {
            $table->unsignedBigInteger('idimportacionproveedorlistacabecera')->nullable()->after('id');

            $table->foreign('idimportacionproveedorlistacabecera', 'fk_ipl_cabecera')
                ->references('id')
                ->on('importacion_proveedor_lista_cabecera')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('importacion_proveedor_listas', function (Blueprint $table) {
            $table->dropForeign('fk_ipl_cabecera');
            $table->dropColumn('idimportacionproveedorlistacabecera');
        });
    }
};
