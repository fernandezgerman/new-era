<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        DB::unprepared(' delete from articuloscostoshistorico; ');

        DB::unprepared("
insert
	into
	articuloscostoshistorico
(idarticulo,
	idcompradetalle,
	fechahora,
	medio,
	idusuario,
	precioauxiliar)
select
	art.id,
	cd.id,
	if(cd.id is null, art.fechamodificacion, cmp.fechahora),
	if(cd.id is null, 'ARTICULOS UPDATE', 'COMPRA') ,
	if(cd.id is null, 1, cmp.idusuario),
	if(cd.id is null, art.costo, null)
from
	articulos as art
left join comprasdetalle as cd on
	art.idcompradetalle = cd.id
left join compras as cmp on
	cd.idcabecera = cmp.id ");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //Nothing to do
    }
};
