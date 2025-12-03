
<?php

use App\Services\MediosDeCobro\Database\AbstractDynamoDBMigrationBase;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration{
    public function up(): void
    {
        Schema::create('mercadopagoqrordernotifications', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('mercadopagoqrorderid')->unsigned();
            $table->string('estado');
            $table->json('notificationdata');
            $table->timestamps();

            $table->index('mercadopagoqrorderid');

            $table->foreign('mercadopagoqrorderid')->references('id')->on('mercadopagoqrorders')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mercadopagoqrordernotifications');
    }
};
