<?php

namespace App\Console\Commands;

use App\Models\Sucursal;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeocodeSucursalesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * Options:
     *  --limit[=N]         Limit number of processed records (useful for testing)
     *  --only-missing      Process only sucursales with NULL latitud/longitud (default)
     *  --include-existing  Process all rows, even if coordinates already set (overrides --only-missing)
     *  --dry-run           Do not persist changes, only show what would be updated
     *  --delay[=ms]        Delay between requests in milliseconds (default: 200)
     */
    protected $signature = 'sucursales:geocode {--limit=} {--only-missing} {--include-existing} {--dry-run} {--delay=200}';

    /**
     * The console command description.
     */
    protected $description = 'Calculate and set latitud/longitud for sucursales using Google Geocoding API';

    public function handle(): int
    {
        $apiKey = config('services.google.geocoding_key');
        if (blank($apiKey)) {
            $this->error('Google Geocoding API key is not configured. Set env GOOGLE_MAPS_API_KEY and config/services.php.');
            return self::FAILURE;
        }

        $onlyMissing = $this->option('include-existing') ? false : true; // default true unless include-existing
        $limit = $this->option('limit');
        $dryRun = (bool) $this->option('dry-run');
        $delayMs = (int) $this->option('delay');

        // Build base query per user-provided SQL
        $query = DB::table('sucursales as suc')
            ->join('provincias as prv', 'suc.idprovincia', '=', 'prv.id')
            ->join('localidades as loc', 'suc.idlocalidad', '=', 'loc.id')
            ->select([
                'suc.id as id',
                'suc.nombre as nombre',
                'suc.direccion as direccion',
                'loc.descripcion as localidad',
                'prv.descripcion as provincia',
                'suc.latitud as latitud',
                'suc.longitud as longitud',
            ]);

        $query->where('suc.activo', '1');
        $query->whereNotIn('suc.id', [2, 22]);
        if ($onlyMissing) {
            $query->whereNull('suc.latitud')->orWhereNull('suc.longitud');
        }
        if (!empty($limit)) {
            $query->limit((int) $limit);
        }

        $rows = $query->get();
        $total = $rows->count();
        if ($total === 0) {
            $this->info('No sucursales to process.');
            return self::SUCCESS;
        }

        $this->info("Processing {$total} sucursales...");
        $processed = 0;
        $updated = 0;
        $failed = 0;

        foreach ($rows as $row) {
            $processed++;
            $addressParts = array_filter([
                $row->direccion,
                $row->localidad,
                $row->provincia,
                'Argentina',
            ]);
            $address = implode(', ', $addressParts);

            try {
                $coords = $this->geocodeAddress($address, $apiKey);
                if (!$coords) {
                    $failed++;
                    $msg = "Geocoding failed (no results) for sucursal {$row->id} - {$row->nombre} | Address: {$address}";
                    Log::warning($msg);
                    $this->warn($msg);
                } else {
                    [$lat, $lng] = $coords;
                    if ($dryRun) {
                        $this->line("[DRY-RUN] Sucursal {$row->id} <- lat: {$lat}, lon: {$lng} | {$address}");
                    } else {
                        DB::table('sucursales')->where('id', $row->id)->update([
                            'latitud' => $lat,
                            'longitud' => $lng,
                        ]);
                    }
                    $updated++;
                }
            } catch (\Throwable $e) {
                $failed++;
                $msg = "Error geocoding sucursal {$row->id} - {$row->nombre}: " . $e->getMessage();
                Log::error($msg, ['exception' => $e]);
                $this->error($msg);
            }

            // polite delay between requests
            if ($delayMs > 0) {
                usleep($delayMs * 1000);
            }
        }

        $this->info("Done. Processed: {$processed}, Updated: {$updated}, Failed: {$failed}");
        return $failed > 0 && $updated === 0 ? self::FAILURE : self::SUCCESS;
    }

    /**
     * Call Google Geocoding API to resolve an address.
     *
     * @return array{0: float, 1: float}|null [lat, lng] or null when not found
     */
    protected function geocodeAddress(string $address, string $apiKey): ?array
    {
        $url = 'https://maps.googleapis.com/maps/api/geocode/json';

        $response = Http::retry(2, 500)
            ->get($url, [
                'address' => $address,
                'key' => $apiKey,
                'language' => 'es',
                'region' => 'ar',
            ]);


        if (!$response->ok()) {
            throw new \RuntimeException('HTTP error ' . $response->status());
        }

        $data = $response->json();
        $status = $data['status'] ?? 'UNKNOWN_ERROR';

        if ($status === 'OVER_QUERY_LIMIT') {
            throw new \RuntimeException('Google Geocoding OVER_QUERY_LIMIT');
        }

        if ($status == 'REQUEST_DENIED') {
            throw new \RuntimeException('Google error:'. $data['error_message'] ?? 'not defined');
        }
        if ($status !== 'OK') {
            // ZERO_RESULTS or others
            return null;
        }

        $results = $data['results'] ?? [];
        if (empty($results)) {
            return null;
        }
        $location = $results[0]['geometry']['location'] ?? null;
        if (!$location || !isset($location['lat'], $location['lng'])) {
            return null;
        }
        return [round((float)$location['lat'], 7), round((float)$location['lng'], 7)];
    }
}
