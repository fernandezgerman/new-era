<?php

namespace App\Services\BalanceGeneral\Queries;

use App\Models\Compra;
use App\Models\VentaSucursal;
use App\Services\BalanceGeneral\DTOs\BalanceGeneraItemDTO;
use App\Services\BalanceGeneral\DTOs\BalanceGeneralFiltersDTO;
use App\Services\BalanceGeneral\Enum\BalanceGeneralItemTipo;
use App\Services\BalanceGeneral\Interface\BalanceResponseDTO;
use App\Services\BalanceGeneral\Interface\Queries;
use \Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;


class GetBalanceGeneralCompras implements Queries
{
    protected $descripcion = 'Solo compras de contado';
    protected $result;

    protected Builder $query;

    protected $tipoBalance = BalanceGeneralItemTipo::COMPRAS;

    public function __construct(protected BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO)
    {
        $this->query = $this->getQuery(
            $balanceGeneralFiltersDTO, $this->tipoBalance === BalanceGeneralItemTipo::GASTOS
        );

        $sql = query_builder_to_raw_sql($this->query);
        $this->result = $this->query->first();
    }

    protected function getQuery(BalanceGeneralFiltersDTO $balanceGeneralFiltersDTO, bool $gastos = false): Builder
    {
        $query = Compra::query()
            ->whereExists(function ($query) use ($gastos) {
                $query->select(DB::raw(1))
                    ->from('comprasdetalle')
                    ->join('articulos', 'comprasdetalle.idarticulo', '=', 'articulos.id')
                    ->join('rubros', 'articulos.idrubro', '=', 'rubros.id')
                    ->where('comprasdetalle.idcabecera', '=', db::raw('compras.id'));
                if ($gastos) {
                    $query->where('rubros.esrubrogastos', '=', '1');
                } else {
                    $query->whereNot('rubros.esrubrogastos', '=', '1');
                }
            });
        $query->where('compras.mododepago', '=', '1');


        if ($balanceGeneralFiltersDTO->dateFrom) {
            $query->where('compras.fechahora', '>=', $balanceGeneralFiltersDTO->dateFrom);
        }

        if ($balanceGeneralFiltersDTO->dateTo) {
            $query->where('compras.fechahora', '<=', $balanceGeneralFiltersDTO->dateTo);
        }

        if ($balanceGeneralFiltersDTO->sucursales) {
            $query->whereIn('compras.idsucursal', $balanceGeneralFiltersDTO->sucursales);
        }

        $query->select(db::raw('sum(totalfactura) as compras'));

        return $query;
    }

    /** Retorna las ventas */
    public function getData(): BalanceResponseDTO
    {
        return new BalanceGeneraItemDTO(
            $this->tipoBalance,
            $this->balanceGeneralFiltersDTO,
            $this->result->compras ?? 0,
            $this->descripcion,
            false
        );
    }
}
