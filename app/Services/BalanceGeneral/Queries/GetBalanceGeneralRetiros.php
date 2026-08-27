<?php

namespace App\Services\BalanceGeneral\Queries;

use App\Models\MovimientoCaja;
use App\Models\VentaSucursal;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Interface\Queries;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class GetBalanceGeneralRetiros implements Queries
{
    protected $descripcion = 'Producto de Division';
    protected $result;
    protected $query;

    protected $tipoBalance = BalanceGeneralItemTipo::RETIROS;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery($balanceGeneralFiltersDTO);
        $this->result = $this->query->first();
    }


    protected function getQuery(BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO): Builder
    {
        $query = MovimientoCaja::query()
            ->join('motivosmovimientoscaja', 'movimientoscaja.idmotivo', '=', 'motivosmovimientoscaja.id');

        if($this->tipoBalance === BalanceGeneralItemTipo::RETIROS){
            $query->where('esretirodecaja', '=', '1');
            if ($balanceGeneralFiltersDTO->sucursales) {
                $query->whereIn('idsucursal', $balanceGeneralFiltersDTO->sucursales);
            }
        }

        if($this->tipoBalance === BalanceGeneralItemTipo::APORTES){
            $query->where('esaportedecaja', '=', '1');
            if ($balanceGeneralFiltersDTO->sucursales) {
                $query->whereIn('idsucursaldestino', $balanceGeneralFiltersDTO->sucursales);
            }
        }

        if ($balanceGeneralFiltersDTO->dateFrom) {
            $query->where('fechahoramovimiento', '>=', $balanceGeneralFiltersDTO->dateFrom);
        }

        if ($balanceGeneralFiltersDTO->dateTo) {
            $query->where('fechahoramovimiento', '<=', $balanceGeneralFiltersDTO->dateTo);
        }

        $query->select(
            db::raw('sum(importe) as totalMovimientos')
        );

        return $query;
    }
    /** Retorna las ventas */
    public function getData(): BalanceResponseDTO
    {
        return new BalanceGeneraItemDTO(
            $this->tipoBalance,
            $this->balanceGeneralFiltersDTO,
            $this->result?->totalMovimientos ?? 0,
            $this->descripcion,
            ($this->tipoBalance === BalanceGeneralItemTipo::APORTES)
        );
    }

}
