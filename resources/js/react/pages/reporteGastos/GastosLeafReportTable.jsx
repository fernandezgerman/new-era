import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Table} from "@/components/Table.jsx";
import {LabelError} from "@/components/Label.jsx";
import {Loading} from "@/components/Loading.jsx";
import {IconButton} from "@/components/Buttons.jsx";
import {faMagnifyingGlass, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useQueries, useQueryClient} from '@tanstack/react-query';
import {useSucursales} from '@/dataHooks/useSucursales.jsx';
import {
    buildGastosTablaRows,
    gastosDetalleFetchKey,
    gastosDetalleMarginXClass,
    gastosDetalleTablaMarcoClass,
    idsucursalFromReporteRow,
    periodoIdFromReporteRow,
    sucursalKeyFromReporteRow,
    tablaHeaderDef,
} from "./gastosReporteTablaUtils.jsx";
import {GastosDetalleSeccionHeader} from "./GastosDetalleSeccionHeader.jsx";
import {GastosDetalleGastosTabla} from "./GastosDetalleGastosTabla.jsx";
import {useGastosRubroPeriodoContexto} from "./GastosRubroPeriodoContexto.jsx";

const buildDetalleParams = (row, idarticulo, sucursalesCatalog) => {
    const idperiodo = periodoIdFromReporteRow(row);
    const idsucursal = idsucursalFromReporteRow(row, sucursalesCatalog);
    const articuloId = Number(idarticulo);
    if (!Number.isFinite(idperiodo) || !Number.isFinite(idsucursal) || !Number.isFinite(articuloId)) {
        return null;
    }
    return {
        key: gastosDetalleFetchKey({idarticulo: articuloId, idperiodo, idsucursal}),
        idperiodo,
        idarticulo: articuloId,
        idsucursal,
    };
};

export const GastosLeafReportTable = ({
    titulo,
    muestraVariacion,
    rows,
    isLoading,
    isError,
    errorMessage,
    emptyText,
    containerClassName = '',
    idrubro,
    idarticulo,
}) => {
    const openContexto = useGastosRubroPeriodoContexto()?.openContexto;
    const queryClient = useQueryClient();
    const {data: sucursalesCatalog} = useSucursales();
    const [expandedDetalleKeys, setExpandedDetalleKeys] = useState(() => new Set());

    useEffect(() => {
        setExpandedDetalleKeys(new Set());
    }, [idarticulo, rows]);

    const header = useMemo(
        () => tablaHeaderDef(muestraVariacion, {incluirSucursal: true}),
        [muestraVariacion],
    );
    const numColumnas = muestraVariacion ? 5 : 4;

    const toggleDetalleExpanded = useCallback((detalleKey) => {
        if (!detalleKey) {
            return;
        }
        setExpandedDetalleKeys((prev) => {
            const next = new Set(prev);
            if (next.has(detalleKey)) {
                next.delete(detalleKey);
            } else {
                next.add(detalleKey);
            }
            return next;
        });
    }, []);

    const expandedDetalleSorted = useMemo(
        () => Array.from(expandedDetalleKeys).sort(),
        [expandedDetalleKeys],
    );

    const invalidateDetalleQueries = useCallback(() => {
        queryClient.invalidateQueries({queryKey: ['gastos-detalle']});
    }, [queryClient]);

    const detalleQueries = useQueries({
        queries: expandedDetalleSorted.map((detalleKey) => {
            const [idarticuloStr, idperiodoStr, idsucursalStr] = detalleKey.split('-');
            return {
                queryKey: ['gastos-detalle', idarticuloStr, idperiodoStr, idsucursalStr],
                enabled: expandedDetalleKeys.has(detalleKey),
                queryFn: async () => {
                    const {data} = await window.axios.get('/api/gastos/detalle', {
                        params: {
                            idperiodo: parseInt(idperiodoStr, 10),
                            idarticulo: parseInt(idarticuloStr, 10),
                            idsucursal: parseInt(idsucursalStr, 10),
                        },
                    });
                    return data ?? [];
                },
            };
        }),
    });

    const detalleMetaPorKey = useMemo(() => {
        const m = new Map();
        expandedDetalleSorted.forEach((key, i) => {
            const q = detalleQueries[i];
            m.set(key, {
                data: q?.data ?? [],
                isLoading: !!q?.isLoading,
                isError: !!q?.isError,
                errorMessage: q?.error?.message,
            });
        });
        return m;
    }, [expandedDetalleSorted, detalleQueries]);

    const data = useMemo(() => {
        const list = rows ?? [];
        const out = [];
        let prevSucursalKey = null;
        let sucursalBloqueIdx = -1;

        const baseRows = buildGastosTablaRows(list, muestraVariacion, {
            incluirSucursal: true,
            onPeriodoClick: openContexto,
            getIdRubroContexto: idrubro != null ? () => idrubro : undefined,
            sucursalColumnContent: ({row, sucursalTxt}) => {
                const detalleParams = buildDetalleParams(row, idarticulo, sucursalesCatalog);
                const detalleAbierto =
                    detalleParams != null && expandedDetalleKeys.has(detalleParams.key);
                const puedeAmpliar = detalleParams != null;

                return (
                    <div className={'flex items-center gap-2'}>
                        {puedeAmpliar ? (
                            <IconButton
                                icon={detalleAbierto ? faXmark : faMagnifyingGlass}
                                className={'m-0! shrink-0 inline-flex!'}
                                title={detalleAbierto ? 'Cerrar movimientos' : 'Ver movimientos'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleDetalleExpanded(detalleParams.key);
                                }}
                            />
                        ) : (
                            <span className={'inline-block w-7 shrink-0'} aria-hidden={true}/>
                        )}
                        <span className={'min-w-0 flex-1'}>{sucursalTxt}</span>
                    </div>
                );
            },
        });

        for (let idx = 0; idx < list.length; idx++) {
            const row = list[idx];
            const sucursalKey = sucursalKeyFromReporteRow(row);
            if (sucursalKey !== prevSucursalKey) {
                sucursalBloqueIdx++;
                prevSucursalKey = sucursalKey;
            }

            out.push(baseRows[idx]);

            const detalleParams = buildDetalleParams(row, idarticulo, sucursalesCatalog);
            if (
                detalleParams != null
                && expandedDetalleKeys.has(detalleParams.key)
            ) {
                const meta = detalleMetaPorKey.get(detalleParams.key) ?? {
                    data: [],
                    isLoading: true,
                    isError: false,
                    errorMessage: null,
                };
                const periodoLabel = (row?.descripcion ?? '').toString();
                out.push({
                    key: 'detail-gastos-' + detalleParams.key + '-' + idx,
                    content: [
                        {
                            key: 'detail-gastos-cell-' + detalleParams.key,
                            colSpan: numColumnas,
                            className:
                                ' p-0! align-top border-t border-slate-200 dark:border-slate-700 '
                                + (sucursalBloqueIdx % 2 === 1
                                    ? ' bg-slate-50 dark:bg-slate-900 '
                                    : ' bg-white dark:bg-slate-950 '),
                            content: (
                                <GastosDetalleGastosTabla
                                    titulo={
                                        sucursalKey
                                        + (periodoLabel ? ' · ' + periodoLabel : '')
                                    }
                                    rows={meta.data}
                                    isLoading={meta.isLoading}
                                    isError={meta.isError}
                                    errorMessage={meta.errorMessage}
                                    idarticulo={detalleParams.idarticulo}
                                    idperiodo={detalleParams.idperiodo}
                                    onGastoSaved={invalidateDetalleQueries}
                                />
                            ),
                        },
                    ],
                });
            }
        }

        return out;
    }, [
        rows,
        muestraVariacion,
        openContexto,
        idrubro,
        idarticulo,
        sucursalesCatalog,
        expandedDetalleKeys,
        detalleMetaPorKey,
        numColumnas,
        toggleDetalleExpanded,
        invalidateDetalleQueries,
    ]);

    if (isLoading) {
        return (
            <div className={gastosDetalleMarginXClass + ' ' + gastosDetalleTablaMarcoClass + ' px-3 py-3'}>
                <GastosDetalleSeccionHeader titulo={titulo}/>
                <div className={'flex items-center justify-center gap-2 py-4 text-slate-700 dark:text-slate-200'}>
                    <Loading/>
                    <span className={'text-sm'}>Cargando detalle…</span>
                </div>
            </div>
        );
    }
    if (isError) {
        return (
            <div className={gastosDetalleMarginXClass + ' ' + gastosDetalleTablaMarcoClass + ' px-4 py-3'}>
                <GastosDetalleSeccionHeader titulo={titulo}/>
                <LabelError>{errorMessage ?? 'Error al cargar el detalle.'}</LabelError>
            </div>
        );
    }
    return (
        <div className={gastosDetalleMarginXClass + ' ' + gastosDetalleTablaMarcoClass + ' px-3 py-3 ' + containerClassName}>
            <GastosDetalleSeccionHeader titulo={titulo}/>
            <Table
                header={header}
                data={data}
                emptyText={emptyText}
                containerClassName={'detalle-rubro-gastos-leaf'}
            />
        </div>
    );
};
