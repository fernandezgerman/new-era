import React, {useMemo} from 'react';
import {Table} from "@/components/Table.jsx";
import {LabelError} from "@/components/Label.jsx";
import {Loading} from "@/components/Loading.jsx";
import {IconButton} from "@/components/Buttons.jsx";
import {faMagnifyingGlass, faXmark} from "@fortawesome/free-solid-svg-icons";
import {
    buildGastosTablaRows,
    gastosDetalleMarginXClass,
    gastosDetalleTablaMarcoClass,
    idFromReporteRow,
    tablaHeaderDef,
} from "./gastosReporteTablaUtils.jsx";
import {GastosLeafReportTable} from "./GastosLeafReportTable.jsx";
import {GastosDetalleSeccionHeader} from "./GastosDetalleSeccionHeader.jsx";
import {useGastosRubroPeriodoContexto} from "./GastosRubroPeriodoContexto.jsx";

/**
 * Detalle por rubro (artículos × periodo). Opcionalmente permite abrir otro nivel: movimientos del artículo.
 */
export const GastosDetalleRubroTabla = ({
    titulo,
    muestraVariacion,
    rows,
    isLoading,
    isError,
    errorMessage,
    articuloDetalle,
    idrubro,
}) => {
    const openContexto = useGastosRubroPeriodoContexto()?.openContexto;

    const header = useMemo(() => tablaHeaderDef(muestraVariacion), [muestraVariacion]);
    const numColumnas = muestraVariacion ? 4 : 3;

    const data = useMemo(() => {
        const list = rows ?? [];
        if (!articuloDetalle) {
            return buildGastosTablaRows(list, muestraVariacion, {
                onPeriodoClick: openContexto,
                getIdRubroContexto: idrubro != null ? () => idrubro : undefined,
            });
        }
        const {expandedArticuloIds, toggleArticuloExpanded, metaPorArticuloId} = articuloDetalle;
        const out = [];
        let prevArticuloNombre = null;
        let articuloBloqueIdx = -1;

        const baseRows = buildGastosTablaRows(list, muestraVariacion, {
            onPeriodoClick: openContexto,
            getIdRubroContexto: idrubro != null ? () => idrubro : undefined,
            primeraColumnaContent: ({grupoNombre, row}) => {
                const idarticulo = idFromReporteRow(row);
                const puedeDetallar = idarticulo != null;
                const detalleAbierto = puedeDetallar && expandedArticuloIds.has(idarticulo);
                return (
                    <div className={'flex items-start gap-2'}>
                        {puedeDetallar ? (
                            <IconButton
                                icon={detalleAbierto ? faXmark : faMagnifyingGlass}
                                className={'m-0! shrink-0 inline-flex!'}
                                title={detalleAbierto ? 'Cerrar detalle' : 'Ver detalle del artículo'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleArticuloExpanded(idarticulo);
                                }}
                            />
                        ) : (
                            <span className={'inline-block w-7 shrink-0'} aria-hidden={true}/>
                        )}
                        <span className={'min-w-0 flex-1 pt-0.5'}>{grupoNombre}</span>
                    </div>
                );
            },
        });

        for (let idx = 0; idx < list.length; idx++) {
            const row = list[idx];
            const articuloNombre = (row?.nombre ?? '').toString();
            if (articuloNombre !== prevArticuloNombre) {
                articuloBloqueIdx++;
                prevArticuloNombre = articuloNombre;
            }

            out.push(baseRows[idx]);

            const esUltimaFilaDelArticulo =
                idx === list.length - 1
                || (list[idx + 1]?.nombre ?? '').toString() !== articuloNombre;

            if (esUltimaFilaDelArticulo) {
                const idarticulo = idFromReporteRow(row);
                if (idarticulo != null && expandedArticuloIds.has(idarticulo)) {
                    const meta = metaPorArticuloId.get(idarticulo) ?? {
                        data: [],
                        isLoading: true,
                        isError: false,
                        errorMessage: null,
                    };
                    out.push({
                        key: 'detail-articulo-' + idarticulo + '-' + idx,
                        content: [
                            {
                                key: 'detail-articulo-cell-' + idarticulo,
                                colSpan: numColumnas,
                                className:
                                    ' p-0! align-top border-t border-slate-200 dark:border-slate-700 '
                                    + (articuloBloqueIdx % 2 === 1
                                        ? ' bg-slate-50 dark:bg-slate-900 '
                                        : ' bg-white dark:bg-slate-950 '),
                                content: (
                                    <GastosLeafReportTable
                                        titulo={articuloNombre}
                                        muestraVariacion={muestraVariacion}
                                        rows={meta.data}
                                        isLoading={meta.isLoading}
                                        isError={meta.isError}
                                        errorMessage={meta.errorMessage}
                                        emptyText={'Sin movimientos para este artículo.'}
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
        rows,
        muestraVariacion,
        articuloDetalle,
        numColumnas,
        openContexto,
        idrubro,
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
        <div className={gastosDetalleMarginXClass + ' ' + gastosDetalleTablaMarcoClass + ' px-3 py-3'}>
            <GastosDetalleSeccionHeader titulo={titulo}/>
            <Table
                header={header}
                data={data}
                emptyText={'Sin movimientos para este rubro.'}
                containerClassName={'detalle-rubro-gastos'}
            />
        </div>
    );
};
