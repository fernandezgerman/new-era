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
        $idfuncion = DB::table('funciones')->where('codigo', 'rep-gastos')->value('id');

        if ($idfuncion) {
            // Perfiles (Asignar a Administrador id=1 y potencialmente otros)
            $perfiles = [8, 26];
            foreach ($perfiles as $idperfil) {
                $exists = DB::table('perfilfuncion')
                    ->where('idperfil', $idperfil)
                    ->where('idfuncion', $idfuncion)
                    ->exists();

                if (!$exists) {
                    DB::table('perfilfuncion')->insert([
                        'idperfil' => $idperfil,
                        'idfuncion' => $idfuncion,
                    ]);
                }
            }

            // Empresas (Asignar a empresa principal id=2 según patrones vistos)
            $idempresa = 2;
            $existsEmpresa = DB::table('empresafuncion')
                ->where('idempresa', $idempresa)
                ->where('idfuncion', $idfuncion)
                ->exists();

            if (!$existsEmpresa) {
                DB::table('empresafuncion')->insert([
                    'idempresa' => $idempresa,
                    'idfuncion' => $idfuncion,
                    'activo' => 1,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $idfuncion = DB::table('funciones')->where('codigo', 'rep-gastos')->value('id');

        if ($idfuncion) {
            DB::table('perfilfuncion')->where('idfuncion', $idfuncion)->delete();
            DB::table('empresafuncion')->where('idfuncion', $idfuncion)->delete();
        }
    }
};
