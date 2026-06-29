<?php

namespace App\Services\Gastos;

use App\Collections\LiquidacionPeriodoCollection;
use App\Collections\SucursalCollection;
use App\DTOs\EditarGastoDTO;
use App\DTOs\GastoDTO;
use App\DTOs\RubroGastoPorPeriodoDTO;
use App\Models\Articulo;
use App\Models\Audit;
use App\Models\Gasto;
use App\Models\GastoDetalle;
use App\Models\LiquidacionPeriodo;
use App\Models\LiquidacionPeriodoGasto;
use App\Models\Proveedor;
use App\Models\Sucursal;
use App\Models\User;
use App\Services\Actualizaciones\ActualizacionesManager;
use App\Services\Gastos\Enums\TiposGastos;
use App\Services\PeriodosContables\Exceptions\NoHayUnPeriodoContableAbiertoException;
use App\Services\PeriodosContables\PeriodosContablesManager;
use App\Services\Gastos\Validators\UpdateGastoValidator;
use App\Mail\GastoActualizadoMail;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class GastosManager
{
    private array $tiposGastos = [];

    public function __construct(
        private ActualizacionesManager   $actualizacionesManager,
        private PeriodosContablesManager $periodosContablesManager,
        private UpdateGastoValidator     $updateGastoValidator
    )
    {
        $this->tiposGastos[TiposGastos::MERCADO_PAGO->value] = [
            "proveedorId" => config('medios_de_cobro.drivers.MercadoPagoQR.gastos.proveedorId'),
            "articuloId" => config('medios_de_cobro.drivers.MercadoPagoQR.gastos.articuloId'),
        ];
    }

    public function createGastoByTipo(
        int         $usuarioId,
        int         $sucursalId,
        float       $totalGasto,
        string      $observaciones,
        TiposGastos $tiposGasto,
        ?string     $numero = null
    ): Gasto
    {

        $gasto = new Gasto();

        $gasto->fechaemision = Carbon::now()->format('Y-m-d H:i:s');
        $gasto->tipofactura = 'discrimina';
        $gasto->idusuario = $usuarioId;
        $gasto->idsucursal = $sucursalId;
        $gasto->totalfactura = $totalGasto;
        $gasto->idproveedor = Arr::get($this->tiposGastos, $tiposGasto->value . '.proveedorId');
        $gasto->numero = $numero ?? 'GST' . Carbon::now()->format('H:i:s');
        $gasto->fechahora = Carbon::now()->format('Y-m-d H:i:s');
        $gasto->numerocaja = null;
        $gasto->idusuariocaja = $usuarioId;
        $gasto->idsucursalcaja = $sucursalId;
        $gasto->mododepago = 1;
        $gasto->idestado = 1;
        $gasto->idtipocomprobante = 1;
        $gasto->observaciones = $observaciones;
        $gasto->fechacreacion = Carbon::now()->format('Y-m-d H:i:s');
        $gasto->idletra = null;
        $gasto->idunico = 'MPGST' . Carbon::now()->format('Y-m-d H:i:s').'S'.$sucursalId.'U'.$usuarioId.'I'.$totalGasto;
        $gasto->save();

        try {
            $periodo = $this->periodosContablesManager->obtenerPeriodoActual();

            LiquidacionPeriodoGasto::create([
                'idgasto' => $gasto->id,
                'idperiodo' => $periodo->id,
            ]);
        } catch (\Throwable $throwable) {
            Log::warning('No hay un periodo contable abierto, no se registro el gasto en ningun periodo. (Se guardo correctamente)');
        }


        $gastoDetalle = new GastoDetalle();

        $gastoDetalle->idcabecera = $gasto->id;
        $gastoDetalle->idarticulo = Arr::get($this->tiposGastos, $tiposGasto->value . '.articuloId');
        $gastoDetalle->cantidad = 1;
        $gastoDetalle->precio = $totalGasto;
        $gastoDetalle->costoanterior = $totalGasto;

        $gastoDetalle->save();

        $this->actualizacionesManager->insertarActualizacion($gasto, $gasto->sucursal);

        return $gasto;
    }

    /**
     * Reporte de gastos por rubro y periodo.
     *
     * @param LiquidacionPeriodoCollection|null $periodos
     * @param string|null $fechaDesde
     * @param string|null $fechaHasta
     * @param SucursalCollection|null $sucursales
     * @return Collection<int, RubroGastoPorPeriodoDTO>
     */
    public function reporteDeGastos(
        ?LiquidacionPeriodoCollection $periodos = null,
        ?string                       $fechaDesde = null,
        ?string                       $fechaHasta = null,
        ?SucursalCollection           $sucursales = null
    ): Collection
    {
        $query = $this->getBaseQuery($periodos, $fechaDesde, $fechaHasta, $sucursales);

        $subquerySql = 'SELECT COUNT(DISTINCT cmp2.idsucursal)
                      FROM compras as cmp2                      JOIN liquidacionesperiodogastos as lpg2 ON cmp2.id = lpg2.idgasto
                      WHERE lpg2.idperiodo = lp.id';

        if ($fechaDesde) {
            $subquerySql .= " AND cmp2.fechaemision >= '$fechaDesde'";
        }
        if ($fechaHasta) {
            $subquerySql .= " AND cmp2.fechaemision <= '$fechaHasta'";
        }

        $results = $query->select(
            'lp.id as periodo_id',
            'lp.descripcion',
            'rbr.nombre',
            'rbr.id',
            DB::raw('sum(cmp.totalfactura) as importe'),
            DB::raw("($subquerySql) as sucursales_per_periodo")
        )
            ->groupBy('rbr.nombre', 'rbr.id', 'lp.descripcion', 'lp.id')
            ->orderBy('rbr.nombre')
            ->orderBy('lp.id', 'desc')
            ->get();

        return $results->map(fn($row) => new RubroGastoPorPeriodoDTO(
            id: $row->id,
            descripcion: $row->descripcion,
            nombre: $row->nombre,
            importe: (float)$row->importe,
            periodoId: $row->periodo_id,
            sucursales_per_periodo: $row->sucursales_per_periodo
        ));
    }

    /**
     * Reporte de gastos para artículos de un rubro específico, agrupado por periodo.
     *
     * @param int $idrubro
     * @param LiquidacionPeriodoCollection|null $periodos
     * @param string|null $fechaDesde
     * @param string|null $fechaHasta
     * @param SucursalCollection|null $sucursales
     * @return Collection<int, RubroGastoPorPeriodoDTO>
     */
    public function reporteDeGastosArticulosPorRubro(
        int                           $idrubro,
        ?LiquidacionPeriodoCollection $periodos = null,
        ?string                       $fechaDesde = null,
        ?string                       $fechaHasta = null,
        ?SucursalCollection           $sucursales = null
    ): Collection
    {
        $query = $this->getBaseQuery($periodos, $fechaDesde, $fechaHasta, $sucursales);

        $subquerySql = 'SELECT COUNT(DISTINCT cmp2.idsucursal)
                      FROM compras as cmp2
                      JOIN liquidacionesperiodogastos as lpg2 ON cmp2.id = lpg2.idgasto
                      WHERE lpg2.idperiodo = lp.id';

        if ($fechaDesde) {
            $subquerySql .= " AND cmp2.fechaemision >= '$fechaDesde'";
        }
        if ($fechaHasta) {
            $subquerySql .= " AND cmp2.fechaemision <= '$fechaHasta'";
        }

        $results = $query->select(
            'lp.id as periodo_id',
            'lp.descripcion',
            'art.nombre',
            'art.id',
            DB::raw('sum(cmp.totalfactura) as importe'),
            DB::raw("($subquerySql) as sucursales_per_periodo")
        )
            ->where('art.idrubro', $idrubro)
            ->groupBy('art.nombre', 'art.id', 'lp.descripcion', 'lp.id')
            ->orderBy('art.nombre')
            ->orderBy('lp.id', 'desc')
            ->get();

        return $results->map(fn($row) => new RubroGastoPorPeriodoDTO(
            id: $row->id,
            descripcion: $row->descripcion,
            nombre: $row->nombre,
            importe: (float)$row->importe,
            periodoId: $row->periodo_id,
            sucursales_per_periodo: $row->sucursales_per_periodo
        ));
    }

    /**
     * Reporte de gastos para un artículo específico, sin agrupar.
     *
     * @param int $idarticulo
     * @param LiquidacionPeriodoCollection|null $periodos
     * @param string|null $fechaDesde
     * @param string|null $fechaHasta
     * @param SucursalCollection|null $sucursales
     * @return Collection<int, RubroGastoPorPeriodoDTO>
     */
    public function reporteDeGastosPorArticulo(
        int                           $idarticulo,
        ?LiquidacionPeriodoCollection $periodos = null,
        ?string                       $fechaDesde = null,
        ?string                       $fechaHasta = null,
        ?SucursalCollection           $sucursales = null
    ): Collection
    {
        $query = $this->getBaseQuery($periodos, $fechaDesde, $fechaHasta, $sucursales);

        $results = $query->select(DB::raw('count(1) as total'), 'lp.descripcion', 'lp.id as periodo_id', 'art.nombre', 'art.id', DB::raw('sum(cmp.totalfactura) as importe'), 'suc.nombre as sucursal_nombre')
            ->join('sucursales as suc', 'cmp.idsucursal', '=', 'suc.id')
            ->where('art.id', $idarticulo)
            ->orderBy('suc.nombre')
            ->orderBy('lp.id', 'desc')
            ->groupBy('lp.descripcion', 'lp.id', 'art.nombre', 'art.id', 'suc.nombre')
            ->get();

        return $results->map(fn($row) => new RubroGastoPorPeriodoDTO(
            id: $row->id,
            descripcion: $row->descripcion,
            nombre: $row->nombre,
            importe: (float)$row->importe,
            sucursal: $row->sucursal_nombre,
            periodoId: $row->periodo_id,
            total: (int)$row->total
        ));
    }

    /**
     * Reporte de gastos para un rubro específico en un contexto de periodo o fechas.
     * Recupera las sucursales relacionadas y los datos del periodo.
     *
     * @param int $idrubro
     * @param int|null $idperiodo
     * @param string|null $fechaDesde
     * @param string|null $fechaHasta
     * @param SucursalCollection|null $sucursales
     * @return array
     */
    public function getPeriodoContexto(
        int $idperiodo = null,
    ): array
    {
        $periodos = null;
        if ($idperiodo) {
            $periodos = LiquidacionPeriodo::where('id', $idperiodo)->get();
        }

        $query = $this->getBaseQuery($periodos);

        // 1 - All sucursales related
        $relatedSucursales = Sucursal::whereIn('id', function ($q) use ($query) {
            $q->select('sub.idsucursal')
                ->fromSub($query->select('cmp.idsucursal'), 'sub');
        })->get();

        // 2 - The liquidacionperiodo data
        $liquidacionPeriodoData = null;
        if ($idperiodo) {
            $liquidacionPeriodoData = LiquidacionPeriodo::find($idperiodo);
        } else {
            // Si no hay periodo, devolvemos los periodos que tocan este rubro en este contexto
            $liquidacionPeriodoData = LiquidacionPeriodo::whereIn('id', function ($q) use ($query) {
                $q->select('lp.id')
                    ->fromSub($query->select('lp.id'), 'sub');
            })->get();
        }

        return [
            'sucursales' => $relatedSucursales,
            'liquidacionperiodo' => $liquidacionPeriodoData,
        ];
    }

    /**
     * Obtiene el detalle de gastos para un periodo, artículo y sucursal específicos.
     *
     * @param int $idperiodo
     * @param int $idarticulo
     * @param int $idsucursal
     * @return Collection<int, GastoDTO>
     */
    public function getGastosDetalle(int $idperiodo, int $idarticulo, int $idsucursal): Collection
    {
        $results = DB::table('compras as cmp')
            ->join('comprasdetalle as cd', 'cmp.id', '=', 'cd.idcabecera')
            ->join('articulos as art', 'cd.idarticulo', '=', 'art.id')
            ->join('sucursales as suc', 'cmp.idsucursal', '=', 'suc.id')
            ->join('liquidacionesperiodogastos as lpg', 'cmp.id', '=', 'lpg.idgasto')
            ->where('lpg.idperiodo', $idperiodo)
            ->where('art.id', $idarticulo)
            ->where('cmp.idsucursal', $idsucursal)
            ->select(
                'cmp.id',
                'cmp.fechaemision as fecha',
                db::raw('(cd.precio * cd.cantidad) as importe'),
                'suc.nombre as sucursal_nombre',
                'art.nombre as articulo_nombre',
                'cmp.observaciones'
            )
            ->get();

        return $results->map(fn($row) => new GastoDTO(
            id: $row->id,
            fecha: $row->fecha,
            comprobante: '',
            importe: (float)$row->importe,
            sucursal: $row->sucursal_nombre,
            articulo: $row->articulo_nombre,
            observaciones: $row->observaciones
        ));
    }

    /**
     * Obtiene la base de la consulta para reportes de gastos.
     *
     * @param LiquidacionPeriodoCollection|null $periodos
     * @param string|null $fechaDesde
     * @param string|null $fechaHasta
     * @param SucursalCollection|null $sucursales
     * @return \Illuminate\Database\Query\Builder
     */
    private function getBaseQuery(
        ?LiquidacionPeriodoCollection $periodos = null,
        ?string                       $fechaDesde = null,
        ?string                       $fechaHasta = null,
        ?SucursalCollection           $sucursales = null
    )
    {
        if (($periodos === null || $periodos->isEmpty()) && $fechaDesde === null && $fechaHasta === null) {
            throw new InvalidArgumentException('Al menos uno de estos filtros deben ser not null: periodos, fecha desde o fecha hasta.');
        }

        $query = DB::table('compras as cmp')
            ->join('comprasdetalle as cd', 'cmp.id', '=', 'cd.idcabecera')
            ->join('articulos as art', 'cd.idarticulo', '=', 'art.id')
            ->join('rubros as rbr', 'art.idrubro', '=', 'rbr.id')
            ->join('liquidacionesperiodogastos as lpg', 'cmp.id', '=', 'lpg.idgasto')
            ->join('liquidacionesperiodo as lp', 'lpg.idperiodo', '=', 'lp.id')
            ->where('rbr.esrubrogastos', 1);

        if ($periodos && $periodos->isNotEmpty()) {
            $query->whereIn('lp.id', $periodos->pluck('id'));
        }

        if ($fechaDesde) {
            $query->where('cmp.fechaemision', '>=', $fechaDesde);
        }

        if ($fechaHasta) {
            $query->where('cmp.fechaemision', '<=', $fechaHasta);
        }

        if ($sucursales && $sucursales->isNotEmpty()) {
            $query->whereIn('cmp.idsucursal', $sucursales->pluck('id'));
        }

        return $query;
    }

    /**
     * Actualiza artículo del detalle y periodo de liquidación de un gasto (compra).
     */
    public function updateGasto(EditarGastoDTO $dto): void
    {
        $this->updateGastoValidator->validar($dto);

        $gastoDetalle = GastoDetalle::where('id', $dto->idCompraDetalle)
            ->where('idcabecera', $dto->idCompra)
            ->first();

        if ($gastoDetalle) {
            $gastoDetalle->update([
                'idarticulo' => $dto->idarticulo,
                'precio' => $dto->importe
            ]);
        }

        $gasto = Gasto::find($dto->idCompra);

        if ($gasto) {
            $gasto->update([
                'fechaemision' => $dto->fechaEmision,
                'totalfactura' => $dto->importe,
                'idsucursal' => $dto->idsucursal,
                'observaciones' => $dto->observaciones,
                'idproveedor' => $dto->idProveedor
            ]);
        }

        if ($dto->idperiodoAnterior !== null && $dto->idperiodoAnterior !== $dto->idperiodo) {
            Audit::create([
                'user_type' => User::class,
                'user_id' => auth()->id(),
                'event' => 'updated',
                'auditable_type' => Gasto::class,
                'auditable_id' => $dto->idCompra,
                'old_values' => ['idperiodo' => $dto->idperiodoAnterior],
                'new_values' => ['idperiodo' => $dto->idperiodo],
                'url' => request()->fullUrl(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::table('liquidacionesperiodogastos')
                ->where('idgasto', $dto->idCompra)
                ->where('idperiodo', $dto->idperiodoAnterior)
                ->delete();
        }

        DB::table('liquidacionesperiodogastos')->updateOrInsert([
            'idgasto' => $dto->idCompra,
            'idperiodo' => $dto->idperiodo,
        ]);

        $this->sendUpdateNotification($dto->idCompra);
    }

    /**
     * Envía una notificación por correo electrónico con los cambios del gasto.
     */
    private function sendUpdateNotification(int $idCompra): void
    {
        $gasto = Gasto::findOrFail($idCompra);
        $historial = $this->getHistorial($idCompra);
        $ultimoCambio = $historial->first() ? collect([$historial->first()]) : collect();

        $emails = [
            config('mail.emails.sistemas.email'),
            config('mail.emails.valeria.email'),
        ];

        Mail::to($emails)->send(new GastoActualizadoMail($gasto, $ultimoCambio));
    }

    /**
     * Obtiene el historial de auditoría de un gasto y sus detalles.
     */
    public function getHistorial(int $id): Collection
    {
        $gasto = Gasto::findOrFail($id);

        $gastoAudits = Audit::where('auditable_type', Gasto::class)
            ->where('auditable_id', $id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        $detalles = GastoDetalle::where('idcabecera', $id)->get();
        $detallesIds = $detalles->pluck('id')->toArray();

        $detallesAudits = Audit::where('auditable_type', GastoDetalle::class)
            ->whereIn('auditable_id', $detallesIds)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        $allAudits = $gastoAudits->concat($detallesAudits)->sortByDesc('created_at')->values();

        return $this->enrichAudits($allAudits);
    }

    /**
     * Enriquece los registros de auditoría con modelos relacionados.
     */
    private function enrichAudits(Collection $audits): Collection
    {
        $sucursalIds = new Collection();
        $proveedorIds = new Collection();
        $articuloIds = new Collection();
        $periodoIds = new Collection();

        foreach ($audits as $audit) {
            $old = $audit->old_values ?? [];
            $new = $audit->new_values ?? [];

            if ($audit->auditable_type === Gasto::class) {
                if (isset($old['idsucursal'])) $sucursalIds->push($old['idsucursal']);
                if (isset($new['idsucursal'])) $sucursalIds->push($new['idsucursal']);
                if (isset($old['idproveedor'])) $proveedorIds->push($old['idproveedor']);
                if (isset($new['idproveedor'])) $proveedorIds->push($new['idproveedor']);
                if (isset($old['idperiodo'])) $periodoIds->push($old['idperiodo']);
                if (isset($new['idperiodo'])) $periodoIds->push($new['idperiodo']);
            }

            if ($audit->auditable_type === GastoDetalle::class) {
                if (isset($old['idarticulo'])) $articuloIds->push($old['idarticulo']);
                if (isset($new['idarticulo'])) $articuloIds->push($new['idarticulo']);
            }
        }

        $sucursales = Sucursal::whereIn('id', $sucursalIds->unique())->get()->keyBy('id');
        $proveedores = Proveedor::whereIn('id', $proveedorIds->unique())->get()->keyBy('id');
        $articulos = Articulo::whereIn('id', $articuloIds->unique())->get()->keyBy('id');
        $periodos = LiquidacionPeriodo::whereIn('id', $periodoIds->unique())->get()->keyBy('id');

        return $audits->map(function ($audit) use ($sucursales, $proveedores, $articulos, $periodos) {
            $old = $audit->old_values ?? [];
            $new = $audit->new_values ?? [];
            $metadata = [];

            if ($audit->auditable_type === Gasto::class) {
                $sIdOld = $old['idsucursal'] ?? null;
                $sIdNew = $new['idsucursal'] ?? null;
                if ($sIdOld && isset($sucursales[$sIdOld])) $metadata['idsucursal_old'] = $sucursales[$sIdOld];
                if ($sIdNew && isset($sucursales[$sIdNew])) $metadata['idsucursal_new'] = $sucursales[$sIdNew];

                $pIdOld = $old['idproveedor'] ?? null;
                $pIdNew = $new['idproveedor'] ?? null;
                if ($pIdOld && isset($proveedores[$pIdOld])) $metadata['idproveedor_old'] = $proveedores[$pIdOld];
                if ($pIdNew && isset($proveedores[$pIdNew])) $metadata['idproveedor_new'] = $proveedores[$pIdNew];

                $perIdOld = $old['idperiodo'] ?? null;
                $perIdNew = $new['idperiodo'] ?? null;
                if ($perIdOld && isset($periodos[$perIdOld])) $metadata['idperiodo_old'] = $periodos[$perIdOld];
                if ($perIdNew && isset($periodos[$perIdNew])) $metadata['idperiodo_new'] = $periodos[$perIdNew];
            }

            if ($audit->auditable_type === GastoDetalle::class) {
                $aIdOld = $old['idarticulo'] ?? null;
                $aIdNew = $new['idarticulo'] ?? null;
                if ($aIdOld && isset($articulos[$aIdOld])) $metadata['idarticulo_old'] = $articulos[$aIdOld];
                if ($aIdNew && isset($articulos[$aIdNew])) $metadata['idarticulo_new'] = $articulos[$aIdNew];
            }

            if (!empty($metadata)) {
                $audit->metadata = $metadata;
            }

            return $audit;
        });
    }


}
