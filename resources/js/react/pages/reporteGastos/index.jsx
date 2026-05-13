import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {PageHeader} from "@/components/H.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {SelectSucursal} from "@/components/selects/SelectSucursales.jsx";
import {SelectLiquidacionPeriodos} from "@/components/selects/SelectLiquidacionPeriodos.jsx";
import {DatePicker} from "@/components/DatePicker.jsx";
import {Button, IconButton} from "@/components/Buttons.jsx";
import {LabelError} from "@/components/Label.jsx";
import {useQueries, useQuery} from "@tanstack/react-query";
import moment from "moment";
import {faMagnifyingGlass, faXmark} from "@fortawesome/free-solid-svg-icons";
import {Table} from "@/components/Table.jsx";
import {processNumber} from "@/utils/numbers.jsx";
import {
    buildGastosReporteQueryParams,
    buildGastosTablaRows,
    formatVariacionPctRespectoSiguiente,
    idFromReporteRow,
    tablaHeaderDef,
} from "./gastosReporteTablaUtils.jsx";
import {GastosDetalleRubroTabla} from "./GastosDetalleRubroTabla.jsx";
import {
    GastosRubroPeriodoContextoProvider,
    useGastosRubroPeriodoContexto,
} from "./GastosRubroPeriodoContexto.jsx";

const toYmd = (date) => {
    if (!date) return null;
    return moment(date).format('YYYY-MM-DD');
}

const cardShellClass =
    'p-4 rounded-lg border border-slate-200/80 bg-white text-slate-900 shadow ' +
    'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]';

const ReporteGastosTablaPrincipal = ({
    dataRaw,
    muestraVariacion,
    expandedRubroIds,
    numColumnas,
    articulosMetaPorRubroId,
    toggleRubroExpanded,
    articuloDetalleEnRubro,
    isFetching,
    submittedFilters,
    totalesPorPeriodoLista,
    totalImporte,
}) => {
    const openContexto = useGastosRubroPeriodoContexto()?.openContexto;

    const tableRows = useMemo(() => {
        const rows = dataRaw ?? [];
        const out = [];
        let prevRubro = null;
        let rubroBloqueIdx = -1;

        const baseRows = buildGastosTablaRows(rows, muestraVariacion, {
            primeraColumnaContent: ({grupoNombre, row}) => {
                const idrubro = idFromReporteRow(row);
                const puedeDetallar = idrubro != null;
                const detalleAbierto = puedeDetallar && expandedRubroIds.has(idrubro);
                return (
                    <div className={'flex items-start gap-2'}>
                        {puedeDetallar ? (
                            <IconButton
                                icon={detalleAbierto ? faXmark : faMagnifyingGlass}
                                className={'m-0! shrink-0 inline-flex!'}
                                title={detalleAbierto ? 'Cerrar detalle' : 'Ver detalle por artículo'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleRubroExpanded(idrubro);
                                }}
                            />
                        ) : (
                            <span className={'inline-block w-7 shrink-0'} aria-hidden={true}/>
                        )}
                        <span className={'min-w-0 flex-1 pt-0.5'}>{grupoNombre}</span>
                    </div>
                );
            },
            onPeriodoClick: openContexto,
            getIdRubroContexto: idFromReporteRow,
        });

        for (let idx = 0; idx < rows.length; idx++) {
            const row = rows[idx];
            const rubroNombre = (row?.nombre ?? '').toString();
            if (rubroNombre !== prevRubro) {
                rubroBloqueIdx++;
                prevRubro = rubroNombre;
            }

            out.push(baseRows[idx]);

            const esUltimaFilaDelRubro =
                idx === rows.length - 1
                || (rows[idx + 1]?.nombre ?? '').toString() !== rubroNombre;

            if (esUltimaFilaDelRubro) {
                const idrubro = idFromReporteRow(row);
                if (idrubro != null && expandedRubroIds.has(idrubro)) {
                    const meta = articulosMetaPorRubroId.get(idrubro) ?? {
                        data: [],
                        isLoading: true,
                        isError: false,
                        errorMessage: null,
                    };
                    out.push({
                        key: 'detail-rubro-' + idrubro + '-' + idx,
                        content: [
                            {
                                key: 'detail-cell-' + idrubro,
                                colSpan: numColumnas,
                                className:
                                    ' p-0! align-top border-t border-slate-200 dark:border-slate-700 '
                                    + (rubroBloqueIdx % 2 === 1
                                        ? ' bg-slate-50 dark:bg-slate-900 '
                                        : ' bg-white dark:bg-slate-950 '),
                                content: (
                                    <GastosDetalleRubroTabla
                                        titulo={rubroNombre}
                                        muestraVariacion={muestraVariacion}
                                        rows={meta.data}
                                        isLoading={meta.isLoading}
                                        isError={meta.isError}
                                        errorMessage={meta.errorMessage}
                                        articuloDetalle={articuloDetalleEnRubro}
                                        idrubro={idrubro}
                                    />
                                ),
                            },
                        ],
                    });
                }
            }
        }

        return out;
    }, [
        dataRaw,
        muestraVariacion,
        expandedRubroIds,
        numColumnas,
        articulosMetaPorRubroId,
        toggleRubroExpanded,
        articuloDetalleEnRubro,
        openContexto,
    ]);

    const tablaHeader = useMemo(() => tablaHeaderDef(muestraVariacion), [muestraVariacion]);

    return (
        <div className={cardShellClass}>
            <Table
                isLoading={isFetching}
                emptyText={submittedFilters ? null : 'Aplique filtros y presione Buscar.'}
                header={tablaHeader}
                data={tableRows}
                className={'dark:ne-dark-body!'}
                footer={
                    <div className={'mt-4 space-y-6 text-slate-900 dark:text-slate-200'}>
                        {totalesPorPeriodoLista.length > 0 && (
                            <div>
                                <div className={'font-bold uppercase text-slate-500 dark:text-slate-500 text-xxs mb-2'}>
                                    Totales por periodo
                                </div>
                                <table
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    className={'table w-full flex'}
                                >
                                    <thead>
                                    <tr>
                                        <th className={'font-bold uppercase text-slate-500 dark:text-slate-500 text-xxs text-left'}>
                                            Periodo
                                        </th>
                                        <th className={'font-bold uppercase text-slate-500 dark:text-slate-500 text-xxs text-right'}>
                                            Total
                                        </th>
                                        {totalesPorPeriodoLista.length > 1 && (
                                            <th className={'font-bold uppercase text-slate-500 dark:text-slate-500 text-xxs text-right'}>
                                                % vs siguiente
                                            </th>
                                        )}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {totalesPorPeriodoLista.map((tp) => (
                                        <tr key={tp.key}>
                                            <td className={'font-normal leading-normal text-sm text-slate-900 dark:text-slate-200'}>{tp.descripcion}</td>
                                            <td className={'font-normal leading-normal text-sm text-right font-semibold text-slate-900 dark:text-slate-100'}>
                                                {processNumber(Number(tp.total ?? 0), 1, true, '$')}
                                            </td>
                                            {totalesPorPeriodoLista.length > 1 && (
                                                <td className={'font-normal leading-normal text-sm text-right tabular-nums text-slate-900 dark:text-slate-300'}>
                                                    {tp.variacionVsSiguiente}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className={'flex justify-end border-t border-slate-200 dark:border-slate-700 pt-4'}>
                            <div className={'text-right'}>
                                <div className={'text-sm text-slate-600 dark:text-slate-500'}>Total general</div>
                                <div className={'text-lg font-bold text-slate-900 dark:text-slate-100'}>{processNumber(totalImporte, 1, true, '$')}</div>
                            </div>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export const ReporteGastos = () => {
    const [periodos, setPeriodos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [fechaDesde, setFechaDesde] = useState(null);
    const [fechaHasta, setFechaHasta] = useState(null);
    const [uiError, setUiError] = useState(null);

    const [submittedFilters, setSubmittedFilters] = useState(null);
    const [expandedRubroIds, setExpandedRubroIds] = useState(() => new Set());
    const [expandedArticuloIds, setExpandedArticuloIds] = useState(() => new Set());

    useEffect(() => {
        setExpandedRubroIds(new Set());
        setExpandedArticuloIds(new Set());
    }, [submittedFilters]);

    const reporteQuery = useQuery({
        queryKey: ['reporte-gastos', submittedFilters],
        enabled: !!submittedFilters,
        queryFn: async () => {
            const params = buildGastosReporteQueryParams(submittedFilters);
            const {data} = await window.axios.get('/api/gastos/reporte', {params});
            return data ?? [];
        },
        select: (data) => data ?? [],
    });

    const dataRaw = reporteQuery.data ?? [];

    /** Mostrar % vs siguiente si el filtro trae 2+ periodos o si los datos ya traen más de un periodo distinto. */
    const muestraVariacion = useMemo(() => {
        const nPeriodosEnFiltro = submittedFilters?.periodos?.length ?? 0;
        if (nPeriodosEnFiltro > 1) {
            return true;
        }
        const rows = dataRaw ?? [];
        const periodosDistintos = new Set();
        for (const r of rows) {
            const d = (r?.descripcion ?? '').toString().trim();
            if (d) {
                periodosDistintos.add(d);
            }
        }
        return periodosDistintos.size > 1;
    }, [submittedFilters?.periodos, dataRaw]);

    const numColumnas = muestraVariacion ? 4 : 3;

    const expandedRubroIdsSorted = useMemo(
        () => Array.from(expandedRubroIds).sort((a, b) => a - b),
        [expandedRubroIds],
    );

    const articulosQueries = useQueries({
        queries: expandedRubroIdsSorted.map((idrubro) => ({
            queryKey: ['reporte-gastos-articulos', idrubro, submittedFilters],
            enabled: !!submittedFilters && expandedRubroIds.has(idrubro),
            queryFn: async () => {
                const params = buildGastosReporteQueryParams(submittedFilters);
                const {data} = await window.axios.get(
                    `/api/gastos/reporte/articulo/${idrubro}/agrupado`,
                    {params},
                );
                return data ?? [];
            },
        })),
    });

    const articulosMetaPorRubroId = useMemo(() => {
        const m = new Map();
        expandedRubroIdsSorted.forEach((id, i) => {
            const q = articulosQueries[i];
            m.set(id, {
                data: q?.data ?? [],
                isLoading: !!q?.isLoading,
                isError: !!q?.isError,
                errorMessage: q?.error?.message,
            });
        });
        return m;
    }, [expandedRubroIdsSorted, articulosQueries]);

    const expandedArticuloIdsSorted = useMemo(
        () => Array.from(expandedArticuloIds).sort((a, b) => a - b),
        [expandedArticuloIds],
    );

    const articuloMovimientosQueries = useQueries({
        queries: expandedArticuloIdsSorted.map((idarticulo) => ({
            queryKey: ['reporte-gastos-articulo-movimientos', idarticulo, submittedFilters],
            enabled: !!submittedFilters && expandedArticuloIds.has(idarticulo),
            queryFn: async () => {
                const params = buildGastosReporteQueryParams(submittedFilters);
                const {data} = await window.axios.get(
                    `/api/gastos/articulo/${idarticulo}/reporte`,
                    {params},
                );
                return data ?? [];
            },
        })),
    });

    const articuloDetalleMetaPorArticuloId = useMemo(() => {
        const m = new Map();
        expandedArticuloIdsSorted.forEach((id, i) => {
            const q = articuloMovimientosQueries[i];
            m.set(id, {
                data: q?.data ?? [],
                isLoading: !!q?.isLoading,
                isError: !!q?.isError,
                errorMessage: q?.error?.message,
            });
        });
        return m;
    }, [expandedArticuloIdsSorted, articuloMovimientosQueries]);

    const totalImporte = useMemo(() => {
        return (dataRaw ?? []).reduce((acc, row) => acc + (Number(row?.importe) || 0), 0);
    }, [dataRaw]);

    const totalesPorPeriodoLista = useMemo(() => {
        const rows = dataRaw ?? [];
        const ordenDescripciones = [];
        const sumas = new Map();
        for (const row of rows) {
            const desc = (row?.descripcion ?? '').toString();
            if (!sumas.has(desc)) {
                sumas.set(desc, 0);
                ordenDescripciones.push(desc);
            }
            sumas.set(desc, sumas.get(desc) + (Number(row?.importe) || 0));
        }
        const n = ordenDescripciones.length;
        return ordenDescripciones.map((descripcion, i) => ({
            key: 'tot-per-' + i + '-' + descripcion,
            descripcion: descripcion || '—',
            total: sumas.get(descripcion) ?? 0,
            variacionVsSiguiente:
                n > 1 && i < n - 1
                    ? formatVariacionPctRespectoSiguiente(
                          sumas.get(ordenDescripciones[i]),
                          sumas.get(ordenDescripciones[i + 1]),
                      )
                    : '',
        }));
    }, [dataRaw]);

    const toggleRubroExpanded = useCallback((idrubro) => {
        setExpandedRubroIds((prev) => {
            const next = new Set(prev);
            if (next.has(idrubro)) {
                next.delete(idrubro);
            } else {
                next.add(idrubro);
            }
            return next;
        });
    }, []);

    const toggleArticuloExpanded = useCallback((idarticulo) => {
        setExpandedArticuloIds((prev) => {
            const next = new Set(prev);
            if (next.has(idarticulo)) {
                next.delete(idarticulo);
            } else {
                next.add(idarticulo);
            }
            return next;
        });
    }, []);

    const articuloDetalleEnRubro = useMemo(
        () => ({
            expandedArticuloIds,
            toggleArticuloExpanded,
            metaPorArticuloId: articuloDetalleMetaPorArticuloId,
        }),
        [expandedArticuloIds, articuloDetalleMetaPorArticuloId, toggleArticuloExpanded],
    );

    const onBuscar = () => {
        setUiError(null);

        const payload = {
            periodos,
            sucursales,
            fecha_desde: toYmd(fechaDesde),
            fecha_hasta: toYmd(fechaHasta),
        };

        const hasPeriodos = (payload.periodos?.length ?? 0) > 0;
        const hasFechaDesde = !!payload.fecha_desde;
        const hasFechaHasta = !!payload.fecha_hasta;

        if (!hasPeriodos && !hasFechaDesde && !hasFechaHasta) {
            setUiError('Al menos uno de estos filtros deben ser proporcionados: periodos, fecha desde o fecha hasta.');
            return;
        }

        setSubmittedFilters(payload);
    }

    return <>
        <PageHeader>Reporte de gastos</PageHeader>
        <br/>

        <GastosRubroPeriodoContextoProvider submittedFilters={submittedFilters}>
            <ErrorBoundary>
                <div className={cardShellClass}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                        <SelectLiquidacionPeriodos
                            multiple={true}
                            setPeriodos={setPeriodos}
                            periodos={periodos}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <SelectSucursal
                            multiple={true}
                            setSucursal={setSucursales}
                            sucursal={sucursales}
                            label={'Sucursales'}
                            placeHolder={'Seleccione sucursales'}
                        />
                    </div>
                    <div>
                        <DatePicker
                            value={fechaDesde}
                            setValue={setFechaDesde}
                            label={'Fecha desde'}
                            placeHolder={'Seleccione fecha desde'}
                            className={'mt-2'}
                        />
                    </div>
                    <div>
                        <DatePicker
                            value={fechaHasta}
                            setValue={setFechaHasta}
                            label={'Fecha hasta'}
                            placeHolder={'Seleccione fecha hasta'}
                            className={'mt-2'}
                        />
                    </div>
                </div>

                {uiError && <div className={'mt-4'}><LabelError>{uiError}</LabelError></div>}
                {reporteQuery.isError && <div className={'mt-4'}><LabelError>{reporteQuery.error?.message ?? 'Error al cargar el reporte.'}</LabelError></div>}

                <div className="flex justify-end mt-4">
                    <Button
                        onClick={onBuscar}
                        disabled={reporteQuery.isFetching}
                        className={'w-full md:w-auto'}
                    >
                        Buscar
                    </Button>
                </div>
            </div>

            <br/>

            <ReporteGastosTablaPrincipal
                dataRaw={dataRaw}
                muestraVariacion={muestraVariacion}
                expandedRubroIds={expandedRubroIds}
                numColumnas={numColumnas}
                articulosMetaPorRubroId={articulosMetaPorRubroId}
                toggleRubroExpanded={toggleRubroExpanded}
                articuloDetalleEnRubro={articuloDetalleEnRubro}
                isFetching={reporteQuery.isFetching}
                submittedFilters={submittedFilters}
                totalesPorPeriodoLista={totalesPorPeriodoLista}
                totalImporte={totalImporte}
            />
        </ErrorBoundary>
        </GastosRubroPeriodoContextoProvider>
    </>;
}
