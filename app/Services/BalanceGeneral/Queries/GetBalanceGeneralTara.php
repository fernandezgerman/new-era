<?php

namespace App\Services\BalanceGeneral\Queries;

use App\Models\Compra;
use App\Models\Pago;
use App\Models\VentaSucursal;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Interface\Queries;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class GetBalanceGeneralTara implements Queries
{
    protected $tipoBalance = BalanceGeneralItemTipo::TARA;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {

    }


    /** Retorna las ventas */
    public function getData(): BalanceResponseDTO
    {
        return new BalanceGeneraItemDTO(
            $this->tipoBalance,
            $this->balanceGeneralFiltersDTO,
            -34409066.65000653,
            'Tara para puesta a cero del balance',
            true
        );
    }
}
