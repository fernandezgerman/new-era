<?php

namespace App\Services\BalanceGeneral\Queries;

use App\Models\MovimientoCaja;
use App\Models\VentaSucursal;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\Queries;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class GetBalanceGeneralAportes extends GetBalanceGeneralRetiros implements Queries
{
    protected $descripcion = null;
    protected $result;

    protected $tipoBalance = BalanceGeneralItemTipo::APORTES;


}
