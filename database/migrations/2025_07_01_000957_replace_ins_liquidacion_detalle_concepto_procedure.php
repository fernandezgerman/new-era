<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the existing procedure if it exists
        DB::unprepared('DROP PROCEDURE IF EXISTS `insLiquidacionDetalleConcepto`');

        // Create the new procedure
        DB::unprepared('
            CREATE PROCEDURE `insLiquidacionDetalleConcepto`(
                IN p_idliquidacion BIGINT(20),
                IN p_importe decimal(40,3),
                IN p_codigo VARCHAR(20)
            )
            BEGIN

                DECLARE v_idconcepto BIGINT(20);

                SELECT
                    id
                INTO
                    v_idconcepto
                FROM
                    liquidacionesconceptos
                WHERE
                    codigo = p_codigo;

                IF v_idconcepto IS NULL THEN
                    SIGNAL SQLSTATE \'45000\' SET MESSAGE_TEXT = \'ATENCION! Concepto inexistente de detalle de liquidacion, comuniquese con el programador.\';
                END IF;


                INSERT INTO liquidaciondetalleconceptos(idliquidaciondetalle,importe,idconcepto)
                VALUES (p_idliquidacion,p_importe,v_idconcepto);

                SELECT @@identity;

            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the procedure
        DB::unprepared('DROP PROCEDURE IF EXISTS `insLiquidacionDetalleConcepto`');
    }
};
