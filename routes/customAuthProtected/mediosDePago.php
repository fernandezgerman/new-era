<?php

use App\Http\Controllers\MediosDeCobro\MediosDeCobroController;
use Illuminate\Support\Facades\Route;

// POST endpoint that the /test button should call
Route::post('/order/preview', [MediosDeCobroController::class, 'orderPreview'])->name('medios-de-pago.order-preview');

Route::post('/order/generate', [MediosDeCobroController::class, 'orderGenerate'])->name('medios-de-pago.order-generate');
