<?php

namespace Tests\Feature;

use App\DTOs\EditarGastoDTO;
use App\Models\Caja;
use App\Models\Compra;
use App\Models\Gasto;
use App\Models\GastoDetalle;
use App\Models\LiquidacionPeriodo;
use App\Models\User;
use App\Services\Gastos\GastosManager;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class UpdateGastoValidationTest extends TestCase
{
    use RefreshDatabase;

    private GastosManager $gastosManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->gastosManager = app(GastosManager::class);
    }

    public function test_cannot_update_importe_if_caja_is_closed()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create a Gasto (Compra)
        $compra = new Compra();
        $compra->id = 100;
        $compra->idusuario = $user->id;
        $compra->idsucursal = 1;
        $compra->totalfactura = 100;
        $compra->numerocaja = 10;
        $compra->idusuariocaja = $user->id;
        $compra->idsucursalcaja = 1;
        $compra->idestado = 1;
        $compra->fechaemision = Carbon::now();
        $compra->idtipocomprobante = 1;
        $compra->mododepago = 1;
        $compra->save();

        $detalle = new GastoDetalle();
        $detalle->id = 200;
        $detalle->idcabecera = $compra->id;
        $detalle->idarticulo = 1;
        $detalle->cantidad = 1;
        $detalle->precio = 100;
        $detalle->save();

        // Create a closed Caja
        $caja = new Caja();
        $caja->numero = 10;
        $caja->idusuario = $user->id;
        $caja->idsucursal = 1;
        $caja->idestado = 1; // Closed
        $caja->fechaapertura = Carbon::now()->subDay();
        $caja->save();

        $dto = new EditarGastoDTO(
            idCompra: $compra->id,
            idCompraDetalle: $detalle->id,
            idarticulo: 1,
            idperiodo: 1,
            idsucursal: 1,
            importe: 150, // Changed importe
            fechaEmision: Carbon::now(),
            idProveedor: 1
        );

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('No se puede modificar el importe de un gasto cuya caja ya está cerrada.');

        $this->gastosManager->updateGasto($dto);
    }

    public function test_cannot_update_importe_if_liquidacion_periodo_is_closed()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create a Gasto (Compra)
        $compra = new Compra();
        $compra->id = 101;
        $compra->idusuario = $user->id;
        $compra->idsucursal = 1;
        $compra->totalfactura = 100;
        $compra->idestado = 1;
        $compra->fechaemision = Carbon::now();
        $compra->idtipocomprobante = 1;
        $compra->mododepago = 1;
        $compra->save();

        $detalle = new GastoDetalle();
        $detalle->id = 201;
        $detalle->idcabecera = $compra->id;
        $detalle->idarticulo = 1;
        $detalle->cantidad = 1;
        $detalle->precio = 100;
        $detalle->save();

        // Create a closed LiquidacionPeriodo
        $periodo = new LiquidacionPeriodo();
        $periodo->id = 1;
        $periodo->descripcion = 'Periodo 1';
        $periodo->idestado = 1; // Closed
        $periodo->fechahora = Carbon::now();
        $periodo->save();

        // Associate Gasto with Periodo
        \Illuminate\Support\Facades\DB::table('liquidacionesperiodogastos')->insert([
            'idgasto' => $compra->id,
            'idperiodo' => $periodo->id,
        ]);

        $dto = new EditarGastoDTO(
            idCompra: $compra->id,
            idCompraDetalle: $detalle->id,
            idarticulo: 1,
            idperiodo: 1,
            idsucursal: 1,
            importe: 150, // Changed importe
            fechaEmision: Carbon::now(),
            idProveedor: 1
        );

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('No se puede modificar el importe de un gasto que pertenece a un periodo de liquidación cerrado.');

        $this->gastosManager->updateGasto($dto);
    }

    public function test_can_update_if_importe_is_same()
    {
        Mail::fake();
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create a Gasto (Compra) in a closed caja
        $compra = new Compra();
        $compra->id = 102;
        $compra->idusuario = $user->id;
        $compra->idsucursal = 1;
        $compra->totalfactura = 100;
        $compra->numerocaja = 11;
        $compra->idusuariocaja = $user->id;
        $compra->idsucursalcaja = 1;
        $compra->idestado = 1;
        $compra->fechaemision = Carbon::now();
        $compra->idtipocomprobante = 1;
        $compra->mododepago = 1;
        $compra->save();

        $detalle = new GastoDetalle();
        $detalle->id = 202;
        $detalle->idcabecera = $compra->id;
        $detalle->idarticulo = 1;
        $detalle->cantidad = 1;
        $detalle->precio = 100;
        $detalle->save();

        $caja = new Caja();
        $caja->numero = 11;
        $caja->idusuario = $user->id;
        $caja->idsucursal = 1;
        $caja->idestado = 1; // Closed
        $caja->fechaapertura = Carbon::now()->subDay();
        $caja->save();

        $dto = new EditarGastoDTO(
            idCompra: $compra->id,
            idCompraDetalle: $detalle->id,
            idarticulo: 1,
            idperiodo: 1,
            idsucursal: 1,
            importe: 100, // Same importe
            fechaEmision: Carbon::now(),
            idProveedor: 1
        );

        // Should not throw exception
        $this->gastosManager->updateGasto($dto);
        $this->assertTrue(true);

        Mail::assertSent(\App\Mail\GastoActualizadoMail::class);
    }
}
