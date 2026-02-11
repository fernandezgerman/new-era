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

        DB::unprepared('DROP FUNCTION IF EXISTS `calcularMultiploVentasNobleza`');

        DB::unprepared("
CREATE  FUNCTION `calcularMultiploVentasNobleza`(
    p_articulo_id bigint(20),
    p_rubro_id bigint(20)
        ) RETURNS decimal(15,2)
    NO SQL
    DETERMINISTIC
BEGIN

	declare v_multiplo decimal(15,2);
	declare v_week  tinyint(4);

	SET v_week = 42;

	SET v_multiplo = 1;

	IF(p_rubro_id = 94)THEN
		SET v_multiplo = 0.1;
	END IF;


	if(p_rubro_id = 4) THEN
			SET v_multiplo = 0.87;
	end if;


RETURN v_multiplo;
END ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP FUNCTION IF EXISTS `calcularMultiploVentasNobleza`');

        DB::unprepared("
CREATE  FUNCTION `calcularMultiploVentasNobleza`(
    p_articulo_id bigint(20),
    p_rubro_id bigint(20)
        ) RETURNS decimal(15,2)
    NO SQL
    DETERMINISTIC
BEGIN

	declare v_multiplo decimal(15,2);
	declare v_week  tinyint(4);

	SET v_week = 42;

	SET v_multiplo = 1;

	IF(p_rubro_id = 94)THEN
		SET v_multiplo = 0.1;
	END IF;


	if(p_rubro_id = 4 and false) THEN
		if(year(now()) =2025 )THEN
			SET v_multiplo = 0.9;
        end if;
    end if;


RETURN v_multiplo;
END ");
    }
};
