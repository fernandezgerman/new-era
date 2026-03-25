<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class FixStock2503Command extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'arreglos-stock:fix-25-03 {--idsucursal= : Filter by sucursal ID} {--idrubro= : Filter by rubro ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Iterate through stock renditions for specific dates and filter by sucursal.';

    /**
     * Execute the console command.s
     *
     * @return int
     */
    public function handle()
    {
        $idsucursal = $this->option('idsucursal');
        $idrubro = $this->option('idrubro');

        $query = DB::table('rendicionesstock as r')
            ->join('sucursales as suc', 'r.idsucursal', '=', 'suc.id')
            ->join('rubros as rbr', 'r.idrubro', '=', 'rbr.id')
            ->join('articulos as art', 'rbr.id', '=', 'art.idrubro')
            ->join('existencias as ex', function ($join) {
                $join->on('suc.id', '=', 'ex.idsucursal')
                    ->on('art.id', '=', 'ex.idarticulo');
            })
            ->select('rbr.nombre as rubro_nombre', 'art.codigo', 'art.nombre as articulo_nombre', 'suc.nombre as sucursal_nombre', 'art.id as idarticulo', 'suc.id as idsucursal')
            ->whereBetween('r.fechaapertura', ['2026-03-24 06:43:29', '2026-03-25 09:36:39'])
            ->groupBy('suc.nombre', 'art.nombre', 'art.id', 'suc.id', 'art.codigo')
            ->orderBy('suc.nombre', 'asc')
            ->orderBy('art.nombre', 'desc');

        if ($idsucursal) {
            $query->where('r.idsucursal', $idsucursal);
        }

        if ($idrubro) {
            $query->where('r.idrubro', $idrubro);
        }

        $results = $query->get();

        if ($results->isEmpty()) {
            $this->info("No results found.");
            return 0;
        }

        $this->info("Found " . $results->count() . " records.");

        $adjustedItems = [];

        foreach ($results as $row) {
            $processed = DB::table('fix_stock_processed_items')
                ->where('idarticulo', $row->idarticulo)
                ->where('idsucursal', $row->idsucursal)
                ->exists();

            if ($processed) {
                $this->warn("Skipping already processed item: Sucursal: {$row->sucursal_nombre} | Articulo: {$row->codigo} - {$row->articulo_nombre}");
                continue;
            }

            $this->line("Sucursal: {$row->sucursal_nombre} | Articulo: {$row->codigo} - {$row->articulo_nombre}");

            $primerDetalle = DB::table('rendicionstockdetalle as rd')
                ->join('rendicionesstock as r', 'rd.idrendicion', '=', 'r.id')
                ->where('r.idsucursal', $row->idsucursal)
                ->where('rd.idarticulo', $row->idarticulo)
                ->where('rd.fechahora', '<', '2026-03-24 17:00:29')
                ->where('rd.id', '>', 17583362)
                ->orderBy('rd.fechahora', 'desc')
                ->first();

            if ($primerDetalle) {
                $this->info("  -> Found previous rendicionstockdetalle ID: {$primerDetalle->id} at {$primerDetalle->fechahora}");

                // A - Existencias model for the given idsucursal, & idarticulo
                $existencia = DB::table('existencias')
                    ->where('idsucursal', $row->idsucursal)
                    ->where('idarticulo', $row->idarticulo)
                    ->first();
                $cantidadExistencia = $existencia ? $existencia->cantidad : 0;

                // B - suma al cantidad de la tabla ventassucursal cuando fechacreacion es mayor a '2026-03-24 06:43:29' para ese articulo y esa sucursal
                $sumaVentas = DB::table('ventassucursal')
                    ->where('idsucursal', $row->idsucursal)
                    ->where('idarticulo', $row->idarticulo)
                    ->where('id','>', 31737241)
                    ->where('fechacreacion', '>', $primerDetalle->fechahora)
                    ->sum('cantidad');

                // C - suma la cantidad en comprasdetalle mientras fechacreacion es mayor a '2026-03-24 06:43:29' (la fecha de creacion esta en la tabla compras, asi que usar un join)
                $sumaCompras = DB::table('comprasdetalle as cd')
                    ->join('compras as c', 'cd.idcabecera', '=', 'c.id')
                    ->where('c.idsucursal', $row->idsucursal)
                    ->where('c.id', '>', 600581)
                    ->where('cd.idarticulo', $row->idarticulo)
                    ->where('c.fechahora', '>', $primerDetalle->fechahora)
                    ->sum('cd.cantidad');

                // D - de todas las rendiciones de stockdetalle para ese idarticulo y ese idsucursal, suma (cantidadrendido - cantidadsistema ) mientras fechahora mayor a '2026-03-24 06:43:29'
                $totalRendiciones = DB::table('rendicionstockdetalle as rd')
                    ->join('rendicionesstock as r', 'rd.idrendicion', '=', 'r.id')
                    ->where('r.idsucursal', $row->idsucursal)
                    ->where('rd.idarticulo', $row->idarticulo)
                    ->where('rd.id', '>', 17583362)
                    ->where('rd.fechahora', '>', $primerDetalle->fechahora)
                    ->sum(DB::raw('cantidadrendida - cantidadsistema'));

                $this->line("    * A - Existencia: {$cantidadExistencia}");
                $this->line("    * B - Suma Ventas: {$sumaVentas}");
                $this->line("    * C - Suma Compras: {$sumaCompras}");
                $this->line("    * D - Suma Rendiciones (Dif): {$totalRendiciones}");
                $total = $cantidadExistencia + $sumaVentas - $sumaCompras - $totalRendiciones;
                $this->line("TOTAL: {$total}");
                $this->line("PRIMER RENDICION RENDICION:  {$primerDetalle->cantidadrendida}");
                $dif = ($primerDetalle->cantidadrendida - $total) * -1;
                $this->line("DIF:  {$dif}");

                if((float)$dif !== 0.0 )
                {
                    if ($this->confirm('¿Desea crear el registro de ajuste para este artículo?', true)) {
                        // Buscar costo de tabla articulos
                        $articulo = DB::table('articulos')->where('id', $row->idarticulo)->first();
                        $costo = $articulo ? $articulo->costo : 0;

                        // Buscar en listadetalle para idarticulo e idlista = 2 la columna precio
                        $listaDetalle = DB::table('listadetalle')
                            ->where('idarticulo', $row->idarticulo)
                            ->where('idlista', 2)
                            ->first();
                        $precio = $listaDetalle ? $listaDetalle->precio : 0;

                        // Buscar la ultima rendicionstock para el idusuario 1, idestado 1 , para esa sucursal y ese rubro
                        $rendicion = DB::table('rendicionesstock')
                            ->where('idusuario', 1)
                            ->where('idestado', 1)
                            ->where('idsucursal', $row->idsucursal)
                            ->where('idrubro', $articulo->idrubro)
                            ->orderBy('id', 'desc')
                            ->first();

                        if (!$rendicion) {
                            $rendicionId = DB::table('rendicionesstock')->insertGetId([
                                'idusuario' => 1,
                                'idestado' => 1,
                                'diferencia' => 0,
                                'idsucursal' => $row->idsucursal,
                                'idrubro' => $articulo->idrubro,
                                'fechaapertura' => '2026-03-24 06:43:31',
                            ]);
                        } else {
                            $rendicionId = $rendicion->id;
                        }

                        // Agregar un registro en rendicionstockdetalle
                        DB::table('rendicionstockdetalle')->insert([
                            'idrendicion' => $rendicionId,
                            'idarticulo' => $row->idarticulo,
                            'cantidadsistema' => $primerDetalle->cantidadrendida,
                            'cantidadrendida' => $total,
                            'fechahora' => Carbon::parse($primerDetalle->fechahora)
                                ->addSecond()           // o ->addSeconds(1)
                                ->format('Y-m-d H:i:s'),
                            'costo' => $costo,
                            'precioventa' => $precio,
                            'valorsistema' => $precio * $primerDetalle->cantidadrendida,
                            'valorrendido' => $precio * $total,
                        ]);

                        $this->info("Registro de ajuste creado exitosamente.");
                        $adjustedItems[] = [
                            'sucursal' => $row->sucursal_nombre,
                            'codigo' => $row->codigo,
                            'articulo' => $row->articulo_nombre,
                            'rubro' => $row->rubro_nombre
                        ];
                    }

                    if (!$this->confirm('¿Desea continuar con el siguiente artículo?', true)) {
                        return 0;
                    }
                }else{
                    $this->line("ART OK!!!!!!!");
                    $this->line("ART OK!!!!!!!");
                }

                // Mark as processed (even if no adjustment was needed, or if user skipped creation,
                // but the logic was executed for this item)
                DB::table('fix_stock_processed_items')->updateOrInsert(
                    ['idarticulo' => $row->idarticulo, 'idsucursal' => $row->idsucursal],
                    ['updated_at' => now(), 'created_at' => now()]
                );

            } else {
                $this->warn("  -> No rendicionstockdetalle found before 2026-03-24 06:43:29");
                // Mark as processed even if no previous detail was found, as requested "sea exito o no"
                DB::table('fix_stock_processed_items')->updateOrInsert(
                    ['idarticulo' => $row->idarticulo, 'idsucursal' => $row->idsucursal],
                    ['updated_at' => now(), 'created_at' => now()]
                );
            }
        }

        if (!empty($adjustedItems)) {
            $this->info("\nResumen de artículos ajustados:");
            $this->table(['Sucursal', 'Código', 'Artículo'], $adjustedItems);
        } else {
            $this->info("\nNo se realizaron ajustes.");
        }

        return 0;
    }
}
