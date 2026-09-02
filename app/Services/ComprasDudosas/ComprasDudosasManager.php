<?php

namespace App\Services\ComprasDudosas;

use App\Models\CompraDudosa;
use App\Models\ListaDetalle;
use App\Services\Compras\Enums\TipoDeSalida;
use App\Services\ComprasDudosas\DTOs\CompraDudosaDetalleDTO;
use App\Services\ComprasDudosas\DTOs\CompraDudosaRuleResultDTO;

class ComprasDudosasManager
{
    private function processTests(CompraDudosaDetalleDTO $compraDudosaDetalleDTO): void
    {
        $tests = config('compras-dudosas.rules');

        foreach ($tests as $test) {
            /** @var CompraDudosaRuleResultDTO $testResult */
            $testResult = (new $test($compraDudosaDetalleDTO))->process($compraDudosaDetalleDTO);
            $listaDetalle = null;

            if(!$testResult->pass){

                if(!$listaDetalle){
                    $listaDetalle = ListaDetalle::where('idarticulo', $compraDudosaDetalleDTO->compraDetalle->idarticulo)
                        ->where('idlista', config('compras-dudosas.lista_precio_comparable_id'))
                        ->first();
                }

                CompraDudosa::create([
                    'idcompra' => $compraDudosaDetalleDTO->compraDetalle->idcabecera,
                    'idcompradetalle' => $compraDudosaDetalleDTO->compraDetalle->id,
                    'observacionescompradudosa' => 'Deteccion automatica',
                    'costoanterior' => $compraDudosaDetalleDTO->compraDetalle->costo_con_impuestos,
                    'precioventa' => $listaDetalle?->precio,
                    'tipodeduda' => $testResult->tipoDeCompraDudosa->value,
                    'indiceinferior' => $testResult->margenComparativo,
                    'indicesuperior' => $testResult->margenComparativo,
                    'idcompradetallecomparacion' => $compraDudosaDetalleDTO->compraDetalleComparable->id
                ]);
                // Con que un criterio no sea pasado es suficiente
                return;
            }
        }

    }

    public function procesarCompraDudosa(int $compraId): void
    {
        $compraAEvaluar = get_entity_or_fail('Compra', $compraId);

      //  $res = $compraAEvaluar->tipo_de_salida;
        if ($compraAEvaluar->tipo_de_salida !== TipoDeSalida::COMPRAS->value) {
            return;
        }

        foreach ($compraAEvaluar->compraDetalles as $compraDetalle) {
            if ($compraDetalle->articulo->compraDetalle) {
                $CompraDudosaDetalleDTO = new CompraDudosaDetalleDTO(
                    $compraDetalle,
                    $compraDetalle->articulo->compraDetalle
                );
                $this->processTests($CompraDudosaDetalleDTO);
            }
            //
        }
    }
}
