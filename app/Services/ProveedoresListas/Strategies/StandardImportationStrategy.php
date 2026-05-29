<?php

namespace App\Services\ProveedoresListas\Strategies;

use App\Models\Articulo;
use App\Services\ProveedoresListas\Collecitons\ImportacionProveedorListaCollection;
use App\Services\ProveedoresListas\Contracts\ImportationStrategyInterface;
use App\Services\ProveedoresListas\DTOs\FuncionalidadDeColumnasDTO;

class StandardImportationStrategy implements ImportationStrategyInterface
{
    public function __construct(
        protected FuncionalidadDeColumnasDTO $dto
    ) {
    }

    private function cleanPriceString(?string $priceString): string
    {
        $value =  str_replace(',', '.', $priceString ?? '');
        $value =  str_replace('$', '', $value);
        return $value;
    }
    public function process(ImportacionProveedorListaCollection $importacionProveedorListaCollection): ImportacionProveedorListaCollection
    {
        $processedCollection = new ImportacionProveedorListaCollection();

        foreach ($importacionProveedorListaCollection as $detalle) {
            $descripcionProceso = $detalle->descripcionproceso ?? [];

            // A - check that the column defined as "precio" are float, no empty.
            if ($this->dto->precio) {
                $precioValue = $this->cleanPriceString($detalle->{$this->dto->precio});
                if (empty($precioValue) || !is_numeric($precioValue)) {
                    $descripcionProceso[] = "Numero invalido";
                }else{
                    $detalle->{$this->dto->precio} = (float)$precioValue;
                }
            }

            // B - if the codigoN is not empty, check if exists some articulo->codigo with this value.
            // If exists, update the ImportacionProveedorListia->idarticulo with his id.
            $codigosEncontrados = false;
            $codigosConfigurados = [];
            if ($this->dto->codigo1) $codigosConfigurados[] = $this->dto->codigo1;
            if ($this->dto->codigo2) $codigosConfigurados[] = $this->dto->codigo2;
            if ($this->dto->codigo3) $codigosConfigurados[] = $this->dto->codigo3;
            if ($this->dto->codigosConComa) $codigosConfigurados[] = $this->dto->codigosConComa;

            //explode(',', trim($this->dto->codigosConComa));
            foreach ($codigosConfigurados as $campoCodigo) {
                $codigoValue = $detalle->{$campoCodigo};
                if (!empty($codigoValue)) {
                    $codigosValue = [$codigoValue];
                    if($campoCodigo === $this->dto->codigosConComa)
                    {
                        $codigosValue = explode(',', trim($codigoValue));
                    }
                    //Recorro todos los codigos y verifico si existe alguno en la base de datos
                    foreach ($codigosValue as $codigo) {
                        $codigosEncontrados = true;
                        $articulo = Articulo::where('codigo', $codigo)->first();
                        if ($articulo) {
                            $detalle->idarticulo = $articulo->id;
                        }
                    }

                }
            }

            // B - At all "codigo" columns are empty, update the ImportacionProveedorLista->descripcionproceso with value "No se encontraron codigos"
            if (!$codigosEncontrados && !empty($codigosConfigurados)) {
                $descripcionProceso[] = "No se encontraron codigos";
            }

            if (!empty($descripcionProceso)) {
                $detalle->descripcionproceso = $descripcionProceso;
            }

            $detalle->save();
            $processedCollection->push($detalle);
        }

        return $processedCollection;
    }
}
