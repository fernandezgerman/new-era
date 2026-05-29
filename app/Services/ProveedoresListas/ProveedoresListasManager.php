<?php

namespace App\Services\ProveedoresListas;

use App\Enums\ImportacionEstado;
use App\Models\Articulo;
use App\Models\ImportacionProveedorLista;
use App\Models\ImportacionProveedorListaCabecera;
use App\Models\Proveedor;
use App\Models\ProveedorLista;
use App\Models\ProveedorListaDetalle;
use App\Services\ProveedoresListas\Collecitons\ImportacionProveedorListaCollection;
use App\Services\ProveedoresListas\DTOs\FuncionalidadDeColumnasDTO;
use App\Services\ProveedoresListas\DTOs\ImportacionProveedorListaDTO;
use App\Services\ProveedoresListas\DTOs\ImportacionProveedorListasDTO;
use App\Services\ProveedoresListas\DTOs\ImportDataDTO;
use App\Services\ProveedoresListas\Enum\SupportedFiles;
use App\Services\ProveedoresListas\Factories\DriverFactory;
use App\Services\ProveedoresListas\Strategies\StandardImportationStrategy;
use Illuminate\Support\Facades\DB;

class ProveedoresListasManager
{
    /**
     * PASO 1 de la importacion
     * 1. Validar que el archivo sea del tipo soportado
     * 2. Validar que el archivo no este vacio
     * 3. Validar que el archivo tenga la estructura correcta
     * 4. Guardar los datos en la base de datos, trayendo la informacion desde el origen de datos (implementando el driver correcto)
     * @param ImportDataDTO $importDataDTO
     * @return ImportacionProveedorListaDTO
     */
    public function importarRegistros(ImportDataDTO $importDataDTO): ImportacionProveedorListaDTO
    {
        return DB::transaction(function () use ($importDataDTO) {
            $idproveedor = $importDataDTO->proveedor->id;

            ImportacionProveedorListaCabecera::whereHas('detalles', function ($query) use ($idproveedor) {
                $query->where('idproveedor', $idproveedor);
            })->get()->each(function ($cabecera) {
                $cabecera->detalles()->delete();
                $cabecera->delete();
            });

            $driver = DriverFactory::make($importDataDTO);
            $rows = $driver->getRows();

            $cabecera = new ImportacionProveedorListaCabecera([
                'idusuario' => auth()->id(),
                'estado' => ImportacionEstado::PENDIENTE,
            ]);
            $cabecera->save();

            $importacionProveedorListaCollection = new ImportacionProveedorListaCollection();
            /** @var ImportacionProveedorListasDTO $importacionProveedorListasDTO */
            foreach ($rows as $importacionProveedorListasDTO) {
                $data = $importacionProveedorListasDTO->toArray();
                $data['idimportacionproveedorlistacabecera'] = $cabecera->id;

                $importacionProveedorListas = new ImportacionProveedorLista($data);
                $importacionProveedorListas->save();

                $importacionProveedorListaCollection->push($importacionProveedorListas);
            }

            return new ImportacionProveedorListaDTO($cabecera, $importacionProveedorListaCollection);
        });
    }

    /**
     * PASO 2 de la importacion
     * @param ImportacionProveedorListaCabecera $cabecera
     * @param FuncionalidadDeColumnasDTO $dto
     * @return ImportacionProveedorListaDTO
     */
    public function definirColumnas(ImportacionProveedorListaCabecera $cabecera, FuncionalidadDeColumnasDTO $dto): ProveedorLista
    {
        return DB::transaction(function () use ($cabecera, $dto) {
            $cabecera->config = $dto->toArray();
            $cabecera->save();

            $detalles = $cabecera->detalles;
            $importacionProveedorListaCollection = new ImportacionProveedorListaCollection($detalles);

            $strategy = new StandardImportationStrategy($dto);
            $strategy->process($importacionProveedorListaCollection);

            return $this->procesarImportacion($cabecera);
        });
    }

    private function procesarImportacion(ImportacionProveedorListaCabecera $importacionProveedorListaCabecera): ProveedorLista
    {
        $config = $importacionProveedorListaCabecera->config;
        $detalles = $importacionProveedorListaCabecera->detalles;

        // We assume all details have the same idproveedor, or we take it from the first one.
        $idProveedor = $detalles->first()?->idproveedor;

        ProveedorLista::where('idproveedor', $idProveedor)->get()->each(function ($lista) {
            $lista->detalles()->delete();
            $lista->delete();
        });

        $proveedorLista = new ProveedorLista([
            'idproveedor' => $idProveedor,
            'idusuario' => auth()->id(),
            'fechalista' => now(),
        ]);
        $proveedorLista->save();

        foreach ($detalles as $detalle) {
            if ($detalle->idarticulo !== null) {
                $precio = $config['precio'] ? $detalle->{$config['precio']} : 0;
                $descripcion = $config['descripcion'] ? $detalle->{$config['descripcion']} : '';

                try{
                    ProveedorListaDetalle::create([
                        'idproveedorlista' => $proveedorLista->id,
                        'idarticulo' => $detalle->idarticulo,
                        'descripciondelproveedor' => $descripcion,
                        'precio' => (float)$precio,
                    ]);
                }catch (\Exception $e){}
            }
        }

        return $proveedorLista;
    }
}
