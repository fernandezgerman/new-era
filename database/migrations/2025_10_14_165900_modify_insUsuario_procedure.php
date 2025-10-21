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

        DB::unprepared('DROP PROCEDURE IF EXISTS `insUsuario`');

        DB::unprepared("
CREATE PROCEDURE `insUsuario`(IN `p_nombre` VARCHAR(120),
                                          IN `p_apellido` VARCHAR(120),
                                          IN `p_domicilio` VARCHAR(120),
                                          IN `p_usuario` VARCHAR(120),
                                          IN `p_clave` VARCHAR(200),
                                          IN `p_email` VARCHAR(500),
                                          IN `p_telefono` VARCHAR(30),
                                          IN `p_codigopostal` VARCHAR(10),
                                          IN `p_idempresa` INT,
                                          IN `p_idperfil` INT,
                                          IN p_activo tinyint(3),
										  IN p_fechaalta date,
										  IN p_fechabaja date)
begin
  declare aux_id BIGINT(20);

    INSERT INTO
    usuarios(nombre, apellido, domicilio,usuario,clave,email,telefono,codigopostal,idempresa,idperfil,activo,fechaalta,fechabaja)
    VALUES
    (p_nombre,p_apellido,p_domicilio,p_usuario,p_clave,p_email,p_telefono,p_codigopostal,p_idempresa,p_idperfil,p_activo,p_fechaalta,p_fechabaja);

    SELECT
        usr.*,
        emp.id as idempresa,
        emp.nombrecomercial,
        per.nombre as nombreperfil,
        per.id as idperfil
    FROM
        (usuarios as usr INNER JOIN empresas emp ON usr.idempresa = emp.id)INNER JOIN
        perfiles as per ON usr.idperfil = per.id

    WHERE usr.id = @@identity ;

    set aux_id = @@identity;
    call insActualizacion('GET-USR',aux_id);
    call insActualizacion('GET-USRSUC', aux_id);
    call insActualizacion('GET-USRSUCCAJ', aux_id);


END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Down simply drops the procedure; if you want to restore previous version, paste the old body here.
        DB::unprepared('DROP PROCEDURE IF EXISTS `insUsuario`');
    }
};
