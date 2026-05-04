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

        DB::unprepared('drop procedure if exists updTransferenciaStockFirma');

        DB::unprepared("
 CREATE PROCEDURE updTransferenciaStockFirma(
    IN p_id BIGINT(20),
    IN p_estadoId BIGINT(20),
    IN p_observaciones VARCHAR(120)
)
BEGIN

    DECLARE v_idtransferencia BIGINT(20);
    DECLARE v_estado_previo BIGINT(20);

	    SELECT idtransferenciastock
	    INTO v_idtransferencia
	    FROM transferenciasstockfirmas
	    WHERE id = p_id;

	    SELECT idestado
	    INTO v_estado_previo
	    FROM transferenciasstock
	    WHERE id = v_idtransferencia;

    IF NOT(v_estado_previo = 3 OR v_estado_previo = 7) THEN


	    -- 1. Actualizamos la firma
	    UPDATE transferenciasstockfirmas
	    SET idestado = p_estadoId,
	        observaciones = p_observaciones,
	        fechahora = NOW()
	    WHERE id = p_id;


	    UPDATE transferenciasstock
	    SET idestado = p_estadoId
	    WHERE id = v_idtransferencia;

	    -- 6. Impactar stock solo si corresponde
	    IF (p_estadoId = 7) THEN
	        CALL setTransferenciaImpactarStock(v_idtransferencia);
	    END IF;

    END IF;

    -- 7. Registro de actualización
    CALL insActualizacion('GET-TRANSSTCK', v_idtransferencia);

    -- 8. Devolvemos los datos actualizados
    SELECT
        tsf.id,
        ts.id AS transferenciaStockId,
        u.id AS usuarioId,
        u.nombre AS usuarioNombre,
        u.apellido AS usuarioApellido,
        tsf.fechahora,
        e.id AS estadoMovimientoCajaId,
        e.descripcion AS estadoMovimientoCajaDescripcion,
        tsf.observaciones,
        tsf.rol
    FROM transferenciasstockfirmas tsf
    INNER JOIN transferenciasstock ts ON tsf.idtransferenciastock = ts.id
    INNER JOIN usuarios u ON tsf.idusuario = u.id
    INNER JOIN estadosmovimientoscaja e ON tsf.idestado = e.id
    WHERE tsf.id = p_id;

END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('drop procedure if exists updTransferenciaStockFirma');

        DB::unprepared("
 CREATE PROCEDURE `updTransferenciaStockFirma`(

in p_id bigint(20),
in p_estadoId  bigint(20),
in p_observaciones varchar(120)	)
BEGIN

DECLARE v_idtransferencia bigint(20);
DECLARE v_descontarstock bigint(20);

update
  transferenciasstockfirmas
set
  idestado = p_estadoId,
  observaciones = p_observaciones,
  fechahora = now()
where
  transferenciasstockfirmas.id = p_id;


SET v_idtransferencia =(SELECT idtransferenciastock FROM transferenciasstockfirmas WHERE id = p_id);

call insActualizacion('GET-TRANSSTCK', v_idtransferencia);

UPDATE transferenciasstock
SET idestado = p_estadoId
WHERE id = v_idtransferencia AND
(p_estadoId = 3 OR
(SELECT COUNT(1)
 FROM transferenciasstockfirmas AS tsf
 WHERE idtransferenciastock = v_idtransferencia AND
       idestado IN (1,8,9)
 ) = 0);

SET v_descontarstock =        (SELECT COUNT(1)
                                FROM transferenciasstockfirmas as tsf
                                WHERE tsf.idtransferenciastock = v_idtransferencia AND
                                      tsf.idestado IN (1,3,8,9));

IF NOT (v_descontarstock >= 1) THEN
  call setTransferenciaImpactarStock(v_idtransferencia);
END IF;



SELECT
  transferenciasstockfirmas.id,
  transferenciasstock.id AS transferenciaStockId,
  usuarios.id AS usuarioId,
  usuarios.nombre AS usuarioNombre,
  usuarios.apellido AS usuarioApellido,
  transferenciasstockfirmas.fechahora,
  estadosmovimientoscaja.id AS estadoMovimientoCajaId,
  estadosmovimientoscaja.descripcion AS estadoMovimientoCajaDescripcion,
  transferenciasstockfirmas.observaciones,
  transferenciasstockfirmas.rol
FROM
  (((transferenciasstockfirmas) INNER JOIN transferenciasstock ON
  transferenciasstockfirmas.idtransferenciastock = transferenciasstock.id ) INNER JOIN usuarios ON
  transferenciasstockfirmas.idusuario = usuarios.id ) INNER JOIN estadosmovimientoscaja ON
  transferenciasstockfirmas.idestado= estadosmovimientoscaja.id
WHERE
  transferenciasstockfirmas.id = p_id;
END");
    }
};
