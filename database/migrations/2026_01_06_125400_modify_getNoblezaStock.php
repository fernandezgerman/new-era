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

        DB::unprepared('drop procedure if exists getNoblezaStock');

        DB::unprepared('
CREATE PROCEDURE `getNoblezaStock`(IN `p_sucursal_id` BIGINT(20))
begin

DECLARE v_numero BIGINT(20);
SELECT
    max(numero) + 1
INTO
    v_numero
FROM
    pedidosnobleza;

IF v_numero IS NULL THEN
    SET v_numero = 1;
END IF;

INSERT INTO `pedidosnobleza` (numero,fechahora) VALUES (v_numero,now());

SELECT
    ex.cantidad,
    art.codigo,
    art.nombre,
    suc.codigonobleza,
    DATE_FORMAT(now(),"%Y%m%d") as fecha,
    v_numero as pedido,
    vts.cantidad as ventas
FROM  existencias AS ex
        INNER JOIN articulos as art ON ex.idarticulo = art.id
        INNER JOIN sucursales as suc ON ex.idsucursal = suc.id
        LEFT JOIN (SELECT
                        sum(cantidad) as cantidad,
                        idarticulo
                    FROM
                        ventassucursal as vs
                    WHERE
                        vs.idsucursal = p_sucursal_id AND
                        DATE_ADD(CURDATE(), INTERVAL -1 DAY) = DATE_FORMAT(fechaenvio,"%Y-%m-%d")
                    GROUP BY
                        idsucursal,idarticulo) as vts ON art.id = vts.idarticulo

WHERE  ex.idsucursal = p_sucursal_id AND
        (art.idrubro = 2 OR art.idrubro = 142) AND
        NOT  codigonobleza is null AND
        not art.codigo in ("77904058","77927965","77900883","77970763")
ORDER BY  art.nombre ;


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
