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

        DB::unprepared('DROP PROCEDURE IF EXISTS `insRendicionStockDetalle`');

        DB::unprepared("
CREATE PROCEDURE `insRendicionStockDetalle`(
in p_rendicionstockid bigint(20),
in p_articuloid bigint(20),
in p_cantidadrendida bigint(20),
in p_preciosistemaunitario decimal(20,3),
in p_preciorendido decimal(20,3),
in p_finalizar tinyint(4),
in p_precioventa decimal(20,3)

)
BEGIN

DECLARE v_idsucursal BIGINT(20);
DECLARE v_posible_rendicion_duplicada BIGINT(20);
DECLARE v_id BIGINT(20);
DECLARE v_totallineas BIGINT(20);
DECLARE v_cantidadsistema DECIMAL(10,3);
DECLARE v_totalpendientes DECIMAL(10,3);
DECLARE v_costo DECIMAL(10,3);
DECLARE v_estado BIGINT(20);
DECLARE v_f_apertura BIGINT(20);

SELECT
	idestado,
    fechaapertura
INTO
	v_estado,
    v_f_apertura
FROM
	rendicionesstock as rs
WHERE rs.id = p_rendicionstockid;


IF(date(v_f_apertura) < date(now()))then
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo se pueden modificar rendiciones si se hicieron el dia de HOY';
end if;




 SELECT id
 INTO v_posible_rendicion_duplicada
 FROM rendicionstockdetalle
 WHERE idrendicion = p_rendicionstockid AND
	 idarticulo = p_articuloid AND
	 cantidadrendida = p_cantidadrendida AND
	 fechahora > DATE_ADD(NOW(), INTERVAL -3 SECOND) AND
	 fechahora < DATE_ADD(NOW(), INTERVAL 3 SECOND) ;

if(v_posible_rendicion_duplicada > 0)THEN
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Posible arreglo duplicado, no se realizaron cambios. En caso de duda, refresque la pagina';
END IF;

  SELECT idsucursal
  INTO v_idsucursal
  FROM rendicionesstock AS rs
  WHERE rs.id = p_rendicionstockid;

  SELECT cantidad
  INTO v_cantidadsistema
  FROM existencias
  WHERE idarticulo = p_articuloid AND
        idsucursal = v_idsucursal ;

SET v_costo  = (SELECT costo
                FROM articulos
                WHERE id = p_articuloid);


   insert into `existencias`(idsucursal,
                              idarticulo,
                              cantidad)
                   values (v_idsucursal,
                           p_articuloid,
                           p_cantidadrendida)
                 ON DUPLICATE KEY
                 UPDATE
                   cantidad = p_cantidadrendida;




INSERT INTO rendicionstockdetalle(
  idrendicion,
  idarticulo,
  cantidadrendida,
  cantidadsistema,
  fechahora,
  costo,
  valorsistema,
  valorrendido,
  precioventa
)
VALUES (
  p_rendicionstockid,
  p_articuloid,
  p_cantidadrendida,
  v_cantidadsistema,
  now(),
  IF(v_costo IS NULL,0,v_costo),
  p_preciosistemaunitario * v_cantidadsistema,
  p_preciorendido,
  IF(p_precioventa IS NULL,0,p_precioventa)
);
SET v_id =  @@identity;

IF (p_finalizar = 1 ) THEN
  UPDATE rendicionesstock as rs SET idestado = 10 WHERE rs.id = p_rendicionstockid;
END IF;

call insActStockVisible(p_articuloid,v_idsucursal);

SELECT
  rendicionstockdetalle.id,
  rendicionesstock.id AS rendicionStockId,
  articulos.id AS articuloId,
  articulos.nombre AS articuloNombre,
  rendicionstockdetalle.cantidadsistema,
  rendicionstockdetalle.cantidadrendida,
  rendicionstockdetalle.fechahora,
  rendicionstockdetalle.costo,
  rendicionstockdetalle.valorsistema,
  rendicionstockdetalle.valorrendido,
  rendicionstockdetalle.precioventa,
  rendicionesstock.idestado,
  es.descripcion as descripcionestado,
	rendicionstockdetalle.fechahora,
    DATE_FORMAT(rendicionstockdetalle.fechahora,'%d %H:%i:%s') as hora
FROM
  (((rendicionstockdetalle) INNER JOIN rendicionesstock ON
  rendicionstockdetalle.idrendicion = rendicionesstock.id ) INNER JOIN articulos ON
  rendicionstockdetalle.idarticulo = articulos.id ) INNER JOIN estadosmovimientoscaja as es
  ON rendicionesstock.idestado = es.id
WHERE
  rendicionstockdetalle.id = v_id;


END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Down simply drops the procedure; if you want to restore previous version, paste the old body here.
        DB::unprepared('DROP PROCEDURE IF EXISTS `insRendicionStockDetalle`');
    }
};
