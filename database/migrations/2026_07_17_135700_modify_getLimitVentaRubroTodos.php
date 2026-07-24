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

        DB::unprepared('drop procedure if exists getLimitVentaRubroTodos');

        DB::unprepared("
CREATE  PROCEDURE `getLimitVentaRubroTodos`()
begin

SELECT
	lvrph.activo ,
	lvrph.horadesde ,
	lvrph.horas ,
	lvrph.id ,
	lvrph.idrubro ,
	rbr.nombre as rubroNombre
FROM

	limites_venta_por_hora_rubros as lvrph
	INNER JOIN rubros AS rbr ON lvrph.idrubro = rbr.id;

END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists getLimitVentaRubroTodos');
    }
};
