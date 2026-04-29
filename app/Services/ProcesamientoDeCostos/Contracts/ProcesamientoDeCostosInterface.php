<?php

namespace App\Services\ProcesamientoDeCostos\Contracts;

use App\Models\CompraDetalle;

interface ProcesamientoDeCostosInterface
{
    public function ShouldBeCostoSetted(CompraDetalle $compradetalle): bool;
}
