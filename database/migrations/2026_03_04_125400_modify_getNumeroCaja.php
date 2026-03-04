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

        DB::unprepared('drop procedure if exists getNumeroCaja');

        DB::unprepared('
            CREATE  PROCEDURE `getNumeroCaja`(in p_idusuario bigint(20),
                                                  in p_idsucursal BIGINT(20),
                                                 out numeroCaja bigint(20))
                MODIFIES SQL DATA
            begin

                DECLARE v_numerocaja BIGINT DEFAULT 0;
                DECLARE v_existe INT DEFAULT 0;
                DECLARE v_cajainicial DECIMAL(20,3)  ;


                SELECT count(1)
                INTO v_existe
                FROM cajas
                WHERE idusuario = p_idusuario AND idsucursal = p_idsucursal AND idestado <> 1 ;



                IF v_existe >= 1 THEN

                  SELECT max(numero)
                  INTO v_numerocaja
                  FROM cajas
                  WHERE idusuario = p_idusuario AND idsucursal = p_idsucursal AND idestado <> 1 ;
                ELSE

                  SELECT MAX(numero)
                  INTO v_numerocaja
                  FROM cajas
                  WHERE idusuario = p_idusuario AND idsucursal = p_idsucursal AND idestado = 1 ;

                  IF v_numerocaja IS NULL THEN

                    SET v_numerocaja = 1;
                  ELSE

                    SET v_numerocaja = v_numerocaja + 1;
                  END IF;

                  set v_cajainicial = (SELECT importerendido
                              FROM cajas
                              WHERE idsucursal = p_idsucursal AND
                                    idusuario = p_idusuario AND
                                    numero = v_numerocaja - 1);

                  INSERT INTO cajas(numero, idusuario,fechaapertura,fechacierre,idsucursal,idestado,cajainicial)
                  VALUES
                  (v_numerocaja,p_idusuario,NOW(), NULL,p_idsucursal,0,v_cajainicial);

                END IF;
                 set numeroCaja = v_numerocaja;
               END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Down simply drops the procedure; if you want to restore previous version, paste the old body here.
        DB::unprepared('drop procedure if exists getNoblezaStock');
    }
};
