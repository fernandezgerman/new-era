import React, {useCallback, useMemo, useState} from "react";
import {PageHeader} from "@/components/H.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {AlternativeCard} from "@/components/Card.jsx";
import {SelectSucursal} from "@/components/selects/SelectSucursales.jsx";
import {SelectLiquidacionPeriodos} from "@/components/selects/SelectLiquidacionPeriodos.jsx";
import {Select} from "@/components/Select.jsx";
import {Button} from "@/components/Buttons.jsx";
import {LabelError} from "@/components/Label.jsx";
import {Table} from "@/components/Table.jsx";
import {Loading} from "@/components/Loading.jsx";
import {AlertNeutral} from "@/components/Alerts.jsx";
import {processNumber} from "@/utils/numbers.jsx";
import {processDate} from "@/utils/dates.jsx";
import {snakeCaseToSpace} from "@/utils/general.js";
import {useSucursales} from "@/dataHooks/useSucursales.jsx";
import moment from "moment";

const TIPO_REPORTE = {
    TOTALIZADO: 'totalizado',
    POR_SUCURSAL: 'por-sucursal',
};

const TIPO_REPORTE_OPTIONS = [
    {value: TIPO_REPORTE.TOTALIZADO, label: 'Totalizado', key: 'totalizado'},
    {value: TIPO_REPORTE.POR_SUCURSAL, label: 'Por Sucursal', key: 'por-sucursal'},
];

const signedTotal = (item) => {
    const total = Number(item?.total) || 0;
    return item?.suma === false ? total * -1 : total;
};

const buildQueryParams = ({periodoDesde, periodoHasta, sucursales}) => {
    const params = {
        idPeriodoLiquidacionDesde: parseInt(periodoDesde.id, 10),
        idPeriodoLiquidacionHasta: parseInt(periodoHasta.id, 10),
    };

    if (sucursales?.length > 0) {
        params.sucursales = sucursales.map((s) => parseInt(s.id, 10));
    }

    return params;
};

const formatMoney = (valor) => processNumber(valor, 2, true, '$');

const compareSortValues = (a, b, direction) => {
    const mul = direction === 'desc' ? -1 : 1;
    if (typeof a === 'number' && typeof b === 'number') {
        return (a - b) * mul;
    }
    return String(a ?? '').localeCompare(String(b ?? ''), 'es', {sensitivity: 'base'}) * mul;
};

const sortIndicator = (sort, key) => {
    if (sort?.key !== key) return '';
    return sort.direction === 'asc' ? ' ▲' : ' ▼';
};

const buildTotalizadoRows = (items) => items.map((item, idx) => {
    const valor = signedTotal(item);
    const tipoLabel = snakeCaseToSpace(item?.tipo ?? '');
    return {
        key: 'bg-item-' + (item?.tipo ?? idx),
        sortValues: {
            tipo: tipoLabel,
            total: valor,
        },
        content: [
            {
                key: 'tipo-' + idx,
                content: <>
                    {tipoLabel}
                    {item?.descripcion && (
                        <span className={'text-xs ml-2 italic'}>({item?.descripcion})</span>
                    )}
                </>,
                className: 'text-lg p-2',
            },
            {
                key: 'total-' + idx,
                className: 'text-right tabular-nums text-lg p-2',
                content: formatMoney(valor),
            },
        ],
    };
});

const buildPorSucursalTable = (result, sucursalNombreById) => {
    const bySucursal = result ?? {};
    const sucursalIds = Object.keys(bySucursal)
        .map((id) => parseInt(id, 10))
        .filter((id) => Number.isFinite(id))
        .sort((a, b) => a - b);

    const tipos = [];
    for (const sucursalId of sucursalIds) {
        for (const item of (bySucursal[sucursalId] ?? bySucursal[String(sucursalId)] ?? [])) {
            if (item?.tipo && !tipos.includes(item.tipo)) {
                tipos.push(item.tipo);
            }
        }
    }

    const columnTotals = Object.fromEntries(tipos.map((tipo) => [tipo, 0]));
    let grandTotal = 0;

    const dataRows = sucursalIds.map((sucursalId) => {
        const items = bySucursal[sucursalId] ?? bySucursal[String(sucursalId)] ?? [];
        const byTipo = new Map(items.map((item) => [item.tipo, item]));
        let rowTotal = 0;
        const sortValues = {
            sucursal: sucursalNombreById.get(sucursalId) ?? ('Sucursal #' + sucursalId),
        };

        const cells = tipos.map((tipo) => {
            const valor = signedTotal(byTipo.get(tipo));
            rowTotal += valor;
            columnTotals[tipo] += valor;
            sortValues['tipo-' + tipo] = valor;
            return {
                key: 'cell-' + sucursalId + '-' + tipo,
                className: 'text-right tabular-nums p-2',
                content: formatMoney(valor),
            };
        });

        grandTotal += rowTotal;
        sortValues['row-total'] = rowTotal;

        return {
            key: 'sucursal-' + sucursalId,
            sortValues,
            content: [
                {
                    key: 'nombre-' + sucursalId,
                    className: 'p-2 font-semibold',
                    content: sortValues.sucursal,
                },
                ...cells,
                {
                    key: 'row-total-' + sucursalId,
                    className: 'text-right tabular-nums p-2 font-semibold',
                    content: formatMoney(rowTotal),
                },
            ],
        };
    });

    const totalRow = dataRows.length > 0 ? {
        key: 'column-totals',
        className: 'font-bold border-t border-slate-300 dark:border-slate-700',
        content: [
            {
                key: 'totales-label',
                className: 'p-2 font-bold',
                content: 'Total',
            },
            ...tipos.map((tipo) => ({
                key: 'col-total-' + tipo,
                className: 'text-right tabular-nums p-2 font-bold',
                content: formatMoney(columnTotals[tipo]),
            })),
            {
                key: 'grand-total',
                className: 'text-right tabular-nums p-2 font-bold',
                content: formatMoney(grandTotal),
            },
        ],
    } : null;

    return {
        tipos,
        dataRows,
        totalRow,
        hasData: sucursalIds.length > 0,
        grandTotal,
    };
};

export const BalanceGeneral = () => {
    const [sucursales, setSucursales] = useState([]);
    const [periodoDesde, setPeriodoDesde] = useState(null);
    const [periodoHasta, setPeriodoHasta] = useState(null);
    const [tipoReporte, setTipoReporte] = useState(TIPO_REPORTE.TOTALIZADO);
    const [uiError, setUiError] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [data, setData] = useState(null);
    const [fetchedTipoReporte, setFetchedTipoReporte] = useState(null);
    const [sort, setSort] = useState(null);

    const {data: sucursalesCatalogo} = useSucursales(true);

    const sucursalNombreById = useMemo(() => {
        const map = new Map();
        (sucursalesCatalogo ?? []).forEach((s) => {
            const id = parseInt(s?.id, 10);
            if (Number.isFinite(id)) {
                map.set(id, s?.nombre ?? ('Sucursal #' + id));
            }
        });
        return map;
    }, [sucursalesCatalogo]);

    const appliedFilters = data?.balanceGeneralFiltersDTO;
    const isTotalizado = fetchedTipoReporte === TIPO_REPORTE.TOTALIZADO;
    const isPorSucursal = fetchedTipoReporte === TIPO_REPORTE.POR_SUCURSAL;

    const toggleSort = useCallback((key) => {
        setSort((prev) => {
            if (prev?.key !== key) {
                return {key, direction: 'asc'};
            }
            if (prev.direction === 'asc') {
                return {key, direction: 'desc'};
            }
            return null;
        });
    }, []);

    const totalizadoItems = data?.balanceGeneralItemDTOCollection ?? [];
    const totalizadoRows = useMemo(() => {
        const rows = buildTotalizadoRows(totalizadoItems);
        if (!sort?.key) return rows;
        return [...rows].sort((a, b) =>
            compareSortValues(a.sortValues?.[sort.key], b.sortValues?.[sort.key], sort.direction),
        );
    }, [totalizadoItems, sort]);

    const totalGeneral = useMemo(
        () => totalizadoItems.reduce((acc, item) => acc + signedTotal(item), 0),
        [totalizadoItems],
    );

    const totalizadoHeader = useMemo(() => [
        {
            name: 'Tipo',
            key: 'tipo',
            onClick: () => toggleSort('tipo'),
            content: 'Tipo' + sortIndicator(sort, 'tipo'),
        },
        {
            name: 'Total',
            key: 'total',
            className: 'text-right',
            onClick: () => toggleSort('total'),
            content: 'Total' + sortIndicator(sort, 'total'),
        },
    ], [sort, toggleSort]);

    const porSucursalBuilt = useMemo(
        () => buildPorSucursalTable(data?.result, sucursalNombreById),
        [data?.result, sucursalNombreById],
    );

    const porSucursalHeader = useMemo(() => {
        const headers = [
            {
                name: 'Sucursal',
                key: 'sucursal',
                onClick: () => toggleSort('sucursal'),
                content: 'Sucursal' + sortIndicator(sort, 'sucursal'),
            },
            ...porSucursalBuilt.tipos.map((tipo) => {
                const key = 'tipo-' + tipo;
                return {
                    name: snakeCaseToSpace(tipo),
                    key,
                    className: 'text-right',
                    onClick: () => toggleSort(key),
                    content: snakeCaseToSpace(tipo) + sortIndicator(sort, key),
                };
            }),
            {
                name: 'Total',
                key: 'row-total',
                className: 'text-right',
                onClick: () => toggleSort('row-total'),
                content: 'Total' + sortIndicator(sort, 'row-total'),
            },
        ];
        return headers;
    }, [porSucursalBuilt.tipos, sort, toggleSort]);

    const porSucursalRows = useMemo(() => {
        const {dataRows, totalRow} = porSucursalBuilt;
        const sorted = !sort?.key
            ? dataRows
            : [...dataRows].sort((a, b) =>
                compareSortValues(a.sortValues?.[sort.key], b.sortValues?.[sort.key], sort.direction),
            );
        return totalRow ? [...sorted, totalRow] : sorted;
    }, [porSucursalBuilt, sort]);

    const onBuscar = async () => {
        setUiError(null);
        setFetchError(null);

        if (!periodoDesde?.id || !periodoHasta?.id) {
            setUiError('Periodo desde y periodo hasta son obligatorios.');
            return;
        }

        const idDesde = parseInt(periodoDesde.id, 10);
        const idHasta = parseInt(periodoHasta.id, 10);

        if (!Number.isFinite(idDesde) || !Number.isFinite(idHasta)) {
            setUiError('Periodo desde y periodo hasta son obligatorios.');
            return;
        }

        if (idDesde > idHasta) {
            setUiError('El periodo desde debe ser menor o igual al periodo hasta.');
            return;
        }

        if (!tipoReporte) {
            setUiError('Seleccione el tipo de reporte.');
            return;
        }

        setIsLoading(true);
        setHasSearched(true);
        setSort(null);

        const endpoint = tipoReporte === TIPO_REPORTE.POR_SUCURSAL
            ? '/api/reportes/balance-general/por-sucursal'
            : '/api/reportes/balance-general/totalizado';

        try {
            const params = buildQueryParams({periodoDesde, periodoHasta, sucursales});
            const {data: responseData} = await window.axios.get(endpoint, {params});
            setData(responseData ?? null);
            setFetchedTipoReporte(tipoReporte);
        } catch (error) {
            setData(null);
            setFetchedTipoReporte(null);
            setFetchError(
                error?.response?.data?.message
                ?? error?.message
                ?? 'Error al cargar el balance general.',
            );
        } finally {
            setIsLoading(false);
        }
    };

    return <>
        <PageHeader>Balance General</PageHeader>
        <ErrorBoundary>
            <AlternativeCard>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <Select
                            options={TIPO_REPORTE_OPTIONS}
                            value={tipoReporte}
                            setValue={setTipoReporte}
                            label={'Tipo de reporte'}
                            placeholder={'Seleccione tipo de reporte'}
                            allowSearch={false}
                            showClearSelection={false}
                            className={'mt-4'}
                        />
                    </div>
                    <div className="lg:col-span-1 md:col-span-1">
                        <SelectSucursal
                            multiple={true}
                            setSucursal={setSucursales}
                            sucursal={sucursales}
                            label={'Sucursales'}
                            placeHolder={'Seleccione sucursales'}
                        />
                    </div>
                    <div>
                        <SelectLiquidacionPeriodos
                            multiple={false}
                            periodos={periodoDesde}
                            setPeriodos={setPeriodoDesde}
                            label={'Periodo desde'}
                            placeHolder={'Seleccione periodo desde'}
                        />
                    </div>
                    <div>
                        <SelectLiquidacionPeriodos
                            multiple={false}
                            periodos={periodoHasta}
                            setPeriodos={setPeriodoHasta}
                            label={'Periodo hasta'}
                            placeHolder={'Seleccione periodo hasta'}
                        />
                    </div>
                </div>

                {uiError && <div className={'mt-4'}><LabelError>{uiError}</LabelError></div>}
                {fetchError && (
                    <div className={'mt-4'}>
                        <LabelError>{fetchError}</LabelError>
                    </div>
                )}

                <div className="flex justify-end mt-4">
                    <Button
                        onClick={onBuscar}
                        disabled={isLoading}
                        className={'w-full md:w-auto'}
                    >
                        Buscar
                    </Button>
                </div>
            </AlternativeCard>

            <br/>

            <AlternativeCard>
                {isLoading && (
                    <div className={'mb-4 flex flex-col items-center gap-3'}>
                        <Loading/>
                        <AlertNeutral className={'text-center'}>
                            Este proceso puede tardar hasta dos minutos
                        </AlertNeutral>
                    </div>
                )}

                {!isLoading && appliedFilters && (
                    <div className={'mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700 dark:text-slate-300'}>
                        <div>
                            <span className={'font-bold uppercase text-slate-500 dark:text-slate-500 text-xxs mr-2'}>
                                Desde
                            </span>
                            {processDate(moment(appliedFilters.dateFrom), true, false)}
                        </div>
                        <div>
                            <span className={'font-bold uppercase text-slate-500 dark:text-slate-500 text-xxs mr-2'}>
                                Hasta
                            </span>
                            {processDate(moment(appliedFilters.dateTo), true, false)}
                        </div>
                    </div>
                )}

                {(!hasSearched || isTotalizado || fetchedTipoReporte == null) && (
                    <Table
                        destacarColumnasPares
                        isLoading={isLoading}
                        emptyText={hasSearched ? null : 'Aplique filtros y presione Buscar.'}
                        header={totalizadoHeader}
                        data={isTotalizado ? totalizadoRows : []}
                        className={'dark:ne-dark-body! '}
                        footer={
                            isTotalizado && !isLoading && totalizadoItems.length > 0 ? (
                                <div className={'mt-4 flex justify-end border-t border-slate-200 dark:border-slate-700 pt-4'}>
                                    <div className={'text-right'}>
                                        <div className={'text-sm text-slate-600 dark:text-slate-500'}>Total general</div>
                                        <div className={' font-bold text-[20px]! text-slate-900 dark:text-slate-100 tabular-nums'}>
                                            {formatMoney(totalGeneral)}
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                    />
                )}

                {isPorSucursal && (
                    <div className={'overflow-x-auto'}>
                        <Table
                            destacarColumnasPares
                            isLoading={isLoading}
                            emptyText={null}
                            header={porSucursalHeader}
                            data={porSucursalRows}
                            className={'dark:ne-dark-body! '}
                        />
                    </div>
                )}
            </AlternativeCard>
        </ErrorBoundary>
    </>;
};
