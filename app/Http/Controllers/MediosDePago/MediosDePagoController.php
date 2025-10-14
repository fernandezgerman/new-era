<?php

namespace App\Http\Controllers\MediosDePago;

use App\Http\Controllers\BaseController;
use App\Http\Requests\MediosDePago\OrderPreviewRequest;

class MediosDePagoController extends BaseController
{

    public function orderPreview(OrderPreviewRequest $orderPreviewRequest)
    {
        // For now, just echo back the validated payload as JSON
        $data = $orderPreviewRequest->validated();
        return response()->json([
            'ok' => true,
            'received' => $data,
        ]);
    }
}
