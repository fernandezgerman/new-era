<?php

namespace App\Events\Events\LimiteVentaPorHoraRubro;

use App\Models\LimiteVentaPorHoraRubro;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class LimiteVentaPorHoraRubroUpdatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public LimiteVentaPorHoraRubro $limiteVentaPorHoraRubro)
    {
        Log::info("LimiteVentaPorHoraRubro UPDATED");
    }

    public function broadcastOn()
    {
        return [];
    }
}
