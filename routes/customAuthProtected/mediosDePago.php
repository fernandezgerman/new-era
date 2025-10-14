<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MediosDePago\MediosDePagoController;

// POST endpoint that the /test button should call
Route::post('/order-preview', [MediosDePagoController::class, 'orderPreview'])->name('medios-de-pago.order-preview');

