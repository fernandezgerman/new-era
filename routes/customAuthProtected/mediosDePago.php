<?php

use App\Http\Controllers\MediosDeCobro\MediosDeCobroController;
use Illuminate\Support\Facades\Route;

// POST endpoint that the /test button should call
Route::post('/order/preview', [MediosDeCobroController::class, 'orderPreview'])->name('medios-de-pago.order-preview');
Route::post('/order/generate', [MediosDeCobroController::class, 'orderGenerate'])->name('medios-de-pago.order-generate');

Route::get('/order/{idunicolegacy}/legacy-preview', [MediosDeCobroController::class, 'orderLegacyPreview'])->name('medios-de-pago.order-legacy-preview');
Route::get('/{idventasucursalcobro}/order', [MediosDeCobroController::class, 'getOrder'])->name('medios-de-pago.get-order');

Route::get('/sucursal/{idSucursal}/usuario/{idUsuario}/order/refund/list', [MediosDeCobroController::class, 'getOrdersToRefund'])->name('medios-de-pago.sucursal.get-orders-refund');

Route::get('/order/{orderId}/refund', [MediosDeCobroController::class, 'showOrderToRefund'])->name('medios-de-pago.sucursal.get-order-to-refund');
Route::post('/order/{orderId}/refund', [MediosDeCobroController::class, 'refundOrder'])->name('medios-de-pago.refund-order');
