<?php

use App\Console\Commands\GeocodeSucursalesCommand;
use App\Console\Commands\TriggerMediosDeCobroStatusChange;
use App\Events\Events\MediosDeCobro\MediosDeCobroStatusChangeEvent;
use App\Services\Actualizaciones\ActualizacionesManager;
use Illuminate\Support\Facades\Route;


Route::get('/test', function () {
    // Fetch latest 15 articulos ordered by id desc and pass to view
    $articulos = \App\Models\Articulo::orderBy('id', 'desc')->limit(8)->get(['id', 'codigo', 'nombre', 'costo']);
    return view('mediosDePago.order-preview-test', compact('articulos'));
});


Route::get('/sendEvent', function () {

    $ventaSucursalCobro = \App\Models\VentaSucursalCobro::where('id', 137)->first();
    event(app(\App\Events\Events\MediosDeCobro\MediosDeCobroStatusChangeEvent::class, ['ventaSucursalCobro' => $ventaSucursalCobro]));

    return 'Hecho';
});


Route::get('/t', function () {

    $id  = ('suc-12_usr-1_1761676832');
    $var = "id:{$id};request-id:026e4b6e-4af3-43e1-a18a-9e409a264e44;ts:1761604838";

    $key = env('MERCADO_PAGO_WEBHOOK_SECRET_KEY');
    $cyphedSignature = hash_hmac('sha256', $var, $key);

    return $cyphedSignature;
});

// Public WebSocket connectivity test page
Route::get('/ws-test', function () {
    $appKey = config('broadcasting.connections.reverb.key') ?? env('REVERB_APP_KEY');

    // Prefer configured host/port/scheme; fall back to current request
    $host = config('broadcasting.connections.reverb.options.host') ?? env('REVERB_HOST') ?? request()->getHost();
    $scheme = config('broadcasting.connections.reverb.options.scheme') ?? env('REVERB_SCHEME', request()->getScheme());
    $useTLS = ($scheme === 'https');

    // If not explicitly set, default to standard ports
    $port = config('broadcasting.connections.reverb.options.port')
        ?? env('REVERB_PORT', $useTLS ? 443 : 80);

    // Sanitize host for browsers: avoid bind addresses like 0.0.0.0 / ::
    if (!$host || in_array($host, ['0.0.0.0', '::', '[::]'], true)) {
        $host = request()->getHost();
    }

    return view('ws-test', compact('appKey', 'host', 'port', 'useTLS'));
});

Route::get('/test-actualizaciones', function () {
    $actualizacionesManager = app(ActualizacionesManager::class);
    $movimientoCaja = \App\Models\MovimientoCaja::first();

    $actualizacionesManager->insertarActualizacion($movimientoCaja);
});

Route::get('/test-actualizacion-sucursal', function () {
    $actualizacionesManager = app(ActualizacionesManager::class);
    $sucursal = \App\Models\Sucursal::where('id', 27)->first();

    $actualizacionesManager->insertarActualizacion($sucursal, $sucursal);
});

Route::get('/test-actualizacion-usuario', function () {
    $actualizacionesManager = app(ActualizacionesManager::class);
    $usuario = \App\Models\User::where('id', 1)->first();

    $sucursal = \App\Models\Sucursal::where('id', 4)->first();

    $actualizacionesManager->insertarActualizacion($usuario, $sucursal);
});

Route::get('/test-mov', function () {
    $ventaSucursalCobro = \App\Models\VentaSucursalCobro::query()->where('id', 54)->first();
    $ventaSucursalCobro->estado = \App\Services\MediosDeCobro\Enums\MedioDeCobroEstados::APROBADO;
    $ventaSucursalCobro->save();

    event(app(MediosDeCobroStatusChangeEvent::class, ['ventaSucursalCobro' => $ventaSucursalCobro]));
});

Route::get('/test-command', function () {
    $cmd = new TriggerMediosDeCobroStatusChange();
    $cmd->handle();
});

Route::get('/test-payment', function () {
    $manager = new \App\Services\MediosDeCobro\ModosDeCobroManager();

    //6
    $ventaSucursalCobro = \App\Models\VentaSucursalCobro::query()->where('id', 6)->first();
    $manager->processTaxesAndFees($ventaSucursalCobro);
});

