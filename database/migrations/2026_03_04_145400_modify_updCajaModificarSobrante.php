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

        DB::unprepared('drop procedure if exists updCajaModificarSobrante');

        DB::unprepared("
           CREATE PROCEDURE `updCajaModificarSobrante`(
                IN `p_idusuario` BIGINT(20),
                IN `p_idusuariocaja` BIGINT(20),
                IN `p_numero` BIGINT(30),
                IN `p_idsucursal` BIGINT(20),
                IN `p_importeanterior` DECIMAL(20,3),
                IN `p_importenuevo` DECIMAL(20,3)
                )
                BEGIN

                DECLARE v_modifico_recien tinyint(4);

                SELECT
                 1
                INTO
                  v_modifico_recien
                FROM
                  cajasobrantesmodificados as sob
                WHERE
                  now() < DATE_ADD(fechahora,INTERVAL 5 MINUTE) AND
                  p_idusuariocaja = sob.idusuariocaja AND
                  numerocaja = p_numero;

                if v_modifico_recien= 1 THEN
                  SELECT -1 as id, 'Deben pasar mas de cinco minutos desde la ultima modificacion de sobrante.' as usuarioCajaNombre;
                ELSE
                    UPDATE cajas
                    SET importerendido = if(importerendido is null,0,importerendido) + (
                                              if(p_importenuevo is null,0,p_importenuevo)
                                            - if(p_importeanterior is null,0,p_importeanterior)
                                            )
                    WHERE numero = p_numero AND idusuario = p_idusuariocaja AND idsucursal = p_idsucursal;


                    UPDATE cajas
                    SET cajainicial = IF(cajainicial IS NULL,0,cajainicial) + (
                                              if(p_importenuevo is null,0,p_importenuevo)
                                            - if(p_importeanterior is null,0,p_importeanterior)
                                            ),
                        importerendido = IF (idestado = 1,
                                                IF (importerendido IS NULL,0,importerendido) +  (
                                              if(p_importenuevo is null,0,p_importenuevo)
                                            - if(p_importeanterior is null,0,p_importeanterior)
                                            ) ,null)
                    WHERE numero > p_numero AND idusuario = p_idusuariocaja AND idsucursal = p_idsucursal;

                    call insCajaSobranteModificado(
                      p_idusuariocaja,
                      p_numero,
                      p_idsucursal,
                      p_importeanterior,
                      p_importenuevo,
                      p_idusuario,
                      now()
                      );
                END IF;
                END
        ");
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
