<?php

namespace App\Services\MediosDeCobro\Drivers\MercadoPagoPoint;

use App\Models\MedioDeCobroSucursalConfiguracion;
use App\Services\MediosDeCobro\Contracts\MedioDeCobroDriverInterface;
use App\Services\MediosDeCobro\Contracts\MedioDeCobroEventHandlerInterface;
use App\Services\MediosDeCobro\Drivers\MercadoPagoBase\MercadoPagoBaseDriver;
use App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Collections\TerminalDTOCollection;
use App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\DTOs\TerminalDTO;
use App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Factories\MercadoPagoPointTerminalsFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\MercadoPagoQRDriver;
use App\Services\MediosDeCobro\DTOs\ConnectionDataDTO;
use App\Services\MediosDeCobro\DTOs\OrderDTO;
use App\Services\MediosDeCobro\DTOs\OrderPaymentDetailDTO;
use App\Services\MediosDeCobro\DTOs\OrderStatusChangeDTO;
use App\Services\MediosDeCobro\DTOs\WebhookEventDTO;
use App\Contracts\Integrations\HttpClient;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Http\MercadoPagoHttpClient;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Factories\MercadoPagoOrderResponseFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoQR\Exceptions\MercadoPagoQRIdempotencyKeyAlreadyTakenException;
use App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Factories\MercadoPagoPointOrderRequestFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Factories\MercadoPagoPointOrderSqlFactory;
use App\Services\MediosDeCobro\Drivers\MercadoPagoPoint\Models\MercadoPagoPointOrderSql;
use App\DataAccessor\MedioDeCobroSucursalConfiguracionDataAccessor;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroConfiguracionException;
use App\Services\MediosDeCobro\Exceptions\MediosDeCobroInvalidOrderException;
use App\Services\MediosDeCobro\Factories\ConnectionDataDTOFactory;
use Illuminate\Support\Arr;
use App\Services\MediosDeCobro\MediosDeCobroNotImplementedException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MercadoPagoPointDriver extends MercadoPagoBaseDriver
{

    public function testConnection(int $sucursalId): bool
    {
        $firstTestPassed = $this->testConnectionByDriver($sucursalId);

        if (!$firstTestPassed) {
            return false;
        }

        try {
            $terminals = $this->getTerminals($sucursalId);
            if ($terminals->count() === 0) {
                throw new MediosDeCobroConfiguracionException('No se encontraron postnets asociados a la caja. Por favor, configure el posnet con la aplicacion. ');
            }
            /** @var TerminalDTO $terminal */
            $terminal = $terminals->first();
            if ($terminal->operating_mode !== 'PDV') {
                //Set terminal as PDV
                 $this->setTerminalAsPDV($terminal);

                $driverConfig = config('medios_de_cobro.drivers.' . $this->connectionDataDTO->modoDeCobro->driver);
                $configuracionPorSucursal = MedioDeCobroSucursalConfiguracion::where('idmododecobro', $driverConfig['local_id'])
                    ->where('idsucursal', $sucursalId)
                    ->first();

                $metadata = $configuracionPorSucursal->metadata ?? [];
                $metadata['terminal'] = [
                    'id' => $terminal->id,
                    'pos_id' => $terminal->pos_id,
                    'store_id' => $terminal->store_id,
                    'external_pos_id' => $terminal->external_pos_id,
                    'operating_mode' => $terminal->operating_mode,
                ];

                $configuracionPorSucursal->metadata = $metadata;
                $configuracionPorSucursal->save();
            }
            return true;

        } catch (\Throwable $throwable) {
            Log::error('Error fetching MP Point terminals: ' . $throwable->getMessage());
            throw $throwable;
        }
    }

    private function getTerminals(int $sucursalId): TerminalDTOCollection
    {
        // GET https://api.mercadopago.com/terminals/v1/list?limit=50&offset=0[&store_id=][&pos_id=]
        // We keep it generic: fetch first page (50). If store/pos filters are needed,
        // endpoint will still return the available terminals without them when permitted.


        $driverConfig = config('medios_de_cobro.drivers.' . $this->connectionDataDTO->modoDeCobro->driver);
        $configuracionPorSucursal = MedioDeCobroSucursalConfiguracion::where('idmododecobro', $driverConfig['local_id'])
            ->where('idsucursal', $sucursalId)
            ->first();


        $storeId = Arr::get($configuracionPorSucursal->metadata, 'store.id');
        $cajaId = Arr::get($configuracionPorSucursal->metadata, 'caja.id');

        $query = [
            'pos_id' => $cajaId,
            'store_id' => $storeId,
            'limit' => 1,
            'offset' => 0,
        ];
        $this->httpClient->host = config('medios_de_cobro.drivers.'.$this->connectionDataDTO->modoDeCobro->driver.'.host_extended_functionalities');
        $response = $this->httpClient->get('terminals/v1/list', $query, );
        $data = method_exists($response, 'getData') ? (array)$response->getData() : [];

        return MercadoPagoPointTerminalsFactory::fromArray($data);
    }

    private function setTerminalAsPDV(TerminalDTO $terminalDTO): void
    {
        try {
            $payload = [
                'terminals' => [
                    [
                        'id' => $terminalDTO->id,
                        'operating_mode' => 'PDV',
                    ],
                ],
            ];

            // PATCH https://api.mercadopago.com/terminals/v1/setup
            $response = $this->httpClient->patch('terminals/v1/setup', $payload);
            $data = method_exists($response, 'getData') ? (array)$response->getData() : [];

            // Response can be { terminals: [...] } or { data: { terminals: [...] } }
            $terminals = Arr::get($data, 'terminals', Arr::get($data, 'data.terminals', []));
            if (!is_array($terminals) || count($terminals) === 0) {
                throw new MediosDeCobroConfiguracionException('No se encontraron postnets asociados a caja.');
            }

            $first = $terminals[0] ?? [];
            $operatingMode = Arr::get($first, 'operating_mode');

            if ($operatingMode!== 'PDV') {
                throw new MediosDeCobroConfiguracionException('No se pudo estable cer el point en como PDV.');
            }
        } catch (\Throwable $throwable) {
            Log::error('Error setting MP Point terminal as PDV: ' . $throwable->getMessage());
            throw $throwable;
        }
    }
}


