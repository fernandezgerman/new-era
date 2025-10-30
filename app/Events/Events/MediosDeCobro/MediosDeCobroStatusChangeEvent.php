<?php

namespace App\Events\Events\MediosDeCobro;

use App\Models\VentaSucursalCobro;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MediosDeCobroStatusChangeEvent  implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public VentaSucursalCobro $ventaSucursalCobro)
    {

    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channel = 'Sucursal-'.$this->ventaSucursalCobro->idsucursal;
        return [
            new Channel($channel),
        ];
    }
}
