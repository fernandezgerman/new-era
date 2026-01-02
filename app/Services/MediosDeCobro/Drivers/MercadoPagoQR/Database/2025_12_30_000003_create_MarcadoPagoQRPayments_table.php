<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration{
    public function up(): void
    {
        Schema::create('mercadopagoqrpayments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('mercadopagoqrorderid')->unsigned();
            $table->string('externalpaymentid', 200);
            $table->json('externalpaymentdata');
            $table->timestamps();

            $table->index('mercadopagoqrorderid');
            $table->index('externalpaymentid');

            $table->foreign('mercadopagoqrorderid')
                ->references('id')
                ->on('mercadopagoqrorders')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mercadopagoqrpayments');
    }
};
