<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoQR;

use App\Contracts\Integrations\HttpClient;
use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Models\Sucursal;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoStoreDTO;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\DTOs\MercadoPagoCajaDTO;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRNotFoundException;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoStoreDTOFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoCajaDTOFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoStoreRequestFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Http\MercadoPagoHttpClient;
use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroConfiguracionException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRFileSyncException;
use phpDocumentor\Parser\Exception;


class MercadoPagoExtendedFunctionalities
{
    private HttpClient $httpClient;

    public function __construct(protected ConnectionDataDTO $connectionDataDTO)
    {
        if (blank($connectionDataDTO->externalUserId)) {
            throw new MediosDeCobroConfiguracionException('No se configuro el userId de mercado pago');
        }

        $this->httpClient = new MercadoPagoHttpClient($connectionDataDTO);

    }
    public function getOrCreateCajaForSucursal(int $idSucursal): MercadoPagoCajaDTO
    {
        $driverConfig = config('medios_de_cobro.drivers.MercadoPagoQR');
        if (blank($driverConfig)) {
            throw new MediosDeCobroConfiguracionException('No se encontro el driver');
        }

        $configuracionPorSucursal = MedioDeCobroSucursalConfiguracion::where('idmododecobro', $driverConfig['local_id'])
            ->where('idsucursal', $idSucursal)
            ->first();

        if (blank($configuracionPorSucursal)) {
            throw new MediosDeCobroConfiguracionException('No hay configuracion asociada a la sucursal y medio de cobro');
        }

        // Ensure metadata is an array structure we can modify
        $metadata = $configuracionPorSucursal->metadata ?? [];
        if (!is_array($metadata)) {
            $metadata = [];
        }

        // 1 - Load data from metadata
        $storeFromMeta = Arr::get($metadata, 'store');
        $cajaFromMeta = Arr::get($metadata, 'caja');

        // 2 - try to create the dtos if the metadata is filled
        $storeDto = is_array($storeFromMeta) ? MercadoPagoStoreDTOFactory::fromArray($storeFromMeta) : null;
        $cajaDto = is_array($cajaFromMeta) ? MercadoPagoCajaDTOFactory::fromArray($cajaFromMeta) : null;

        // 3 - if some dto were not filled, try getting or saving it from MP
        $storeDtoToBeSaved = $storeDto === null ? $this->getOrCreateStore($idSucursal) : null;
        $cajaDtoToBeSaved = $cajaDto === null ? $this->getOrCreateCaja($idSucursal) : null;

        //4 - if some of those vars were getted, save it
        if($storeDtoToBeSaved !== null || $cajaDtoToBeSaved !== null){
            $metadata['store'] = $storeDtoToBeSaved === null ? $metadata['store'] : get_object_vars($storeDtoToBeSaved);
            $metadata['caja'] = $cajaDtoToBeSaved === null ? $metadata['caja'] : get_object_vars($cajaDtoToBeSaved);

            $configuracionPorSucursal->metadata = $metadata;
            $configuracionPorSucursal->save();
        }

        // Finally, return the already existing dto from metadata or the created one
        return $cajaDto ?? $cajaDtoToBeSaved;
    }

    private function getOrCreateCaja(int $idSucursal): MercadoPagoCajaDTO
    {
        try {
            $cajaDto = $this->getCaja($idSucursal);
        } catch (MercadoPagoQRNotFoundException $e) {
            $cajaDto = $this->insCaja($idSucursal);
        }

        try{
            $logURL = self::getOrCreateQrImage($cajaDto);
        }catch (MercadoPagoQRFileSyncException $e)
        {
            //If an error happens when sync qr, ignore it since the system must try again each time is needed
        }

        return $cajaDto;
    }

    public static function getOrCreateQrImage(MercadoPagoCajaDTO $cajaDto): string
    {
        try {
            $fileName = 'MERCADO_PAGO_QR_' . $cajaDto->id.'.jpg'; // nombre exacto solicitado
            $disk = Storage::disk('public');

            // Si ya existe el archivo, devolver la URL pública directamente
            if ($disk->exists($fileName)) {
                return $disk->url($fileName);
            }

            // Obtener URL del QR desde el DTO
            $qrImageUrl = null;
            if (is_array($cajaDto->qr ?? null)) {
                $qrImageUrl = $cajaDto->qr['image'] ?? null;
            }

            if (blank($qrImageUrl) || !is_string($qrImageUrl)) {
                throw new Exception('No se encontro la URL de la imagen del QR');
            }

            // Descargar y guardar la imagen si no existe
            $response = Http::timeout(15)->get($qrImageUrl);
            if (!$response->successful()) {
                throw new Exception('No se pudo descargar la imagen del QR desde Mercado Pago');
            }

            $saved = $disk->put($fileName, $response->body());
            if (!$saved) {
                throw new Exception('No se pudo guardar la imagen del QR en el storage publico');
            }

            return $disk->url($fileName);
        } catch (\Throwable $ex) {
            Log::error('Error saving the QR iamge:'.$ex->getMessage());
            throw new MercadoPagoQRFileSyncException($ex->getMessage(), $ex->getCode(), $ex);
        }
    }
    private function getOrCreateStore(int $idSucursal): MercadoPagoStoreDTO
    {
        try {
            $storeDto = $this->getStore((string)$idSucursal);
        } catch (MercadoPagoQRNotFoundException $e) {
            $storeDto = $this->insStore((string)$idSucursal);
        }
        return $storeDto;
    }

    public function getOrCreateCajaForSucursal2(int $idSucursal): MercadoPagoCajaDTO
    {
        $driverConfig = config('medios_de_cobro.drivers.MercadoPagoQR');
        if (blank($driverConfig)) {
            throw new MediosDeCobroConfiguracionException('No se encontro el driver');
        }

        $configuracionPorSucursal = MedioDeCobroSucursalConfiguracion::where('idmododecobro', $driverConfig['local_id'])
            ->where('idsucursal', $idSucursal)
            ->first();

        if (blank($configuracionPorSucursal)) {
            throw new MediosDeCobroConfiguracionException('No hay configuracion asociada a la sucursal y medio de cobro');
        }

        // Ensure metadata is an array structure we can modify
        $metadata = $configuracionPorSucursal->metadata ?? [];
        if (!is_array($metadata)) {
            $metadata = [];
        }

        // 1) Try from metadata first
        $storeFromMeta = Arr::get($metadata, 'store');
        $cajaFromMeta = Arr::get($metadata, 'caja');

        $storeDto = null;
        if (is_array($storeFromMeta)) {
            try {
                $storeDto = MercadoPagoStoreDTOFactory::fromArray($storeFromMeta);
            } catch (\Throwable $e) {
                $storeDto = null; // ignore malformed
            }
        }

        if (is_array($cajaFromMeta)) {
            try {
                $cajaDto = MercadoPagoCajaDTOFactory::fromArray($cajaFromMeta);
                // If caja was in metadata, ensure store is also set; if not, attempt to load it
                if (!$storeDto && $cajaDto->external_store_id) {
                    try {
                        // external_store_id has the external id like 'SUCSUCID'; fetch the store
                        $storeDto = $this->getStore((string)$idSucursal);
                    } catch (MercadoPagoQRNotFoundException $e) {
                        // will re-create below
                        $storeDto = null;
                    }
                }
                // We have caja; make sure to return after persisting metadata as needed
                // Persist both if not present
                if (!Arr::get($metadata, 'store') && $storeDto) {
                    $metadata['store'] = get_object_vars($storeDto);
                }
                // Ensure caja saved too (normalize data)
                $metadata['caja'] = get_object_vars($cajaDto);
                $configuracionPorSucursal->metadata = $metadata;
                $configuracionPorSucursal->save();
                return $cajaDto;
            } catch (\Throwable $e) {
                // ignore malformed caja in metadata; proceed to fetch/create
            }
        }

        // 2) Store: try to get from API using external_id; if not found, create
        if (!$storeDto) {
            try {
                $storeDto = $this->getStore((string)$idSucursal);
            } catch (MercadoPagoQRNotFoundException $e) {
                $storeDto = $this->insStore((string)$idSucursal);
            }
            // Persist store in metadata
            $metadata['store'] = get_object_vars($storeDto);
            $configuracionPorSucursal->metadata = $metadata;
            $configuracionPorSucursal->save();
        }

        // 3) Caja: try to get from API; if not found, create
        try {
            $cajaDto = $this->getCaja($idSucursal);
        } catch (MercadoPagoQRNotFoundException $e) {
            $cajaDto = $this->insCaja($idSucursal);
        }

        // Persist caja in metadata
        $metadata['caja'] = get_object_vars($cajaDto);
        $configuracionPorSucursal->metadata = $metadata;
        $configuracionPorSucursal->save();

        return $cajaDto;
    }

    /**
     * Get a Mercado Pago store by sucursal id.
     *
     * @param string $sucursalId
     * @return MercadoPagoStoreDTO
     * @throws MediosDeCobroConfiguracionException
     * @throws MercadoPagoQRNotFoundException
     */
    public function getStore(string $sucursalId): MercadoPagoStoreDTO
    {
        $userId = $this->connectionDataDTO->externalUserId ?? null;

        $externalId = 'SUC' . $sucursalId;
        $uri = 'users/' . $userId . '/stores/search'; //?external_id=' . urlencode($externalId);

        try {

            $response = $this->httpClient->get($uri, ['external_id' => $externalId]);
            $data = $response->getData();
        } catch (\Throwable $e) {
            if ($e->getMessage() === 'store_not_found') {
                throw new MercadoPagoQRNotFoundException($e->getMessage());
            };
            throw $e;
        }

        // The API may return an object with 'results' or an array wrapping it
        $results = [];
        if (is_array($data)) {
            if (array_key_exists('results', $data)) {
                $results = (array)Arr::get($data, 'results', []);
            } elseif (isset($data[0]) && is_array($data[0]) && array_key_exists('results', $data[0])) {
                $results = (array)Arr::get($data[0], 'results', []);
            }
        }

        if (empty($results)) {
            throw new MercadoPagoQRNotFoundException('Mercado Pago store not found for external_id ' . $externalId);
        }

        $first = $results[0];
        if (!is_array($first)) {
            throw new MercadoPagoQRNotFoundException('Mercado Pago store response malformado para external_id ' . $externalId);
        }

        return MercadoPagoStoreDTOFactory::fromArray($first);
    }

    public function insStore(string $sucursalId): MercadoPagoStoreDTO
    {
        // Validate user id
        $userId = $this->connectionDataDTO->externalUserId ?? null;
        if (blank($userId)) {
            throw new MediosDeCobroConfiguracionException('No se configuro el userId de mercado pago');
        }

        // Load sucursal data
        $sucursal = \App\Models\Sucursal::find($sucursalId);
        if (!$sucursal) {
            throw new MercadoPagoQRNotFoundException('Sucursal no encontrada: ' . $sucursalId);
        }

        $payload = MercadoPagoStoreRequestFactory::buildForCreateStore($sucursal, $sucursalId);

        $uri = 'users/' . $userId . '/stores';
        $response = $this->httpClient->post($uri, $payload);
        $data = $response->getData();

        // Normalize field names expected by the factory
        if (isset($data['date_created']) && !isset($data['date_creation'])) {
            $data['date_creation'] = $data['date_created'];
        }

        return MercadoPagoStoreDTOFactory::fromArray($data);
    }

    /**
     * Get a Mercado Pago Caja (POS) by sucursal id.
     *
     * Consumes GET pos?external_id=...
     * external_id format: 'SUC' . $sucursalId . 'CAJA1'
     * Returns the first result or throws MercadoPagoQRNotFoundException when empty.
     *
     * @param int $sucursalId
     * @return MercadoPagoCajaDTO
     * @throws MercadoPagoQRNotFoundException
     */
    public function getCaja(int $sucursalId): MercadoPagoCajaDTO
    {
        $externalId = 'SUC' . $sucursalId . 'CAJA1';
        $uri = 'pos';

        try {

            $response = $this->httpClient->get($uri, ['external_id' => $externalId]);
            $data = $response->getData();
        } catch (\Throwable $throwable) {
            if ($throwable->getMessage() === 'store_not_found') {
                new MercadoPagoQRNotFoundException($throwable->getMessage());
            }
            throw $throwable;
        }

        // Normalize and extract results
        $results = [];
        if (is_array($data)) {
            if (array_key_exists('results', $data)) {
                $results = (array)Arr::get($data, 'results', []);
            } elseif (isset($data[0]) && is_array($data[0]) && array_key_exists('results', $data[0])) {
                $results = (array)Arr::get($data[0], 'results', []);
            }
        }

        if (empty($results)) {
            throw new MercadoPagoQRNotFoundException('Mercado Pago caja (POS) not found for external_id ' . $externalId);
        }

        $first = $results[0];
        if (!is_array($first)) {
            throw new MercadoPagoQRNotFoundException('Mercado Pago caja (POS) response malformado para external_id ' . $externalId);
        }

        return MercadoPagoCajaDTOFactory::fromArray($first);
    }

    /**
     * Create (insert) a Mercado Pago Caja (POS) for the given sucursal id.
     *
     * Endpoint: POST pos
     * Body:
     * {
     *   "name": "Caja para sucursal n " . $idsucursal,
     *   "fixed_amount": true,
     *   "external_store_id": "SUC" . $idsucursal,
     *   "external_id": "SUC" . $idsucursal . "CAJA1"
     * }
     *
     * @param int $idsucursal
     * @return MercadoPagoCajaDTO
     */
    public function insCaja(int $idsucursal): MercadoPagoCajaDTO
    {
        $sucursal = Sucursal::where('id', $idsucursal)->first();
        // Build request payload as per spec
        $payload = [
            'name' => 'Caja '.$sucursal->nombre,
            'fixed_amount' => true,
            'external_store_id' => 'SUC' . $idsucursal,
            'external_id' => 'SUC' . $idsucursal . 'CAJA1',
        ];

        $uri = 'pos';
        try {
            $response = $this->httpClient->post($uri, $payload);
            $data = $response->getData();
        } catch (\Throwable $throwable) {
            if ($throwable->getMessage() === 'non_existent_external_store_id') {
                sleep(5);
                try {
                    $response = $this->httpClient->post($uri, $payload);
                    $data = $response->getData();
                } catch (\Throwable $throwable) {
                    throw new Exception('Error al crear la caja, aguarde un minuto y presione el boton de check.');
                }
            }
        }

        return MercadoPagoCajaDTOFactory::fromArray($data);
    }
}


