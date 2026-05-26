import React from 'react';
import {processNumber} from "@/utils/numbers.jsx";

/** Margen horizontal (40px) en cada panel de detalle anidado. */
export const gastosDetalleMarginXClass = 'mx-[40px]';

/** Marco común: borde redondeado y margen vertical (~10px) en cada tabla de detalle. */
export const gastosDetalleTablaMarcoClass =
    'my-[10px] rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden ' +
    'bg-white dark:bg-slate-950 shadow-sm';

export const formatVariacionPctRespectoSiguiente = (importeActual, importeSiguiente) => {
    const cur = Number(importeActual);
    const sig = Number(importeSiguiente);
    if (!Number.isFinite(cur) || !Number.isFinite(sig) || sig === 0) {
        return '—';
    }
    const pct = ((cur - sig) / sig) * 100;
    const absFmt = new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(Math.abs(pct));
    if (pct > 0) return '+' + absFmt + ' %';
    if (pct < 0) return '−' + absFmt + ' %';
    return '0,0 %';
};

/** `id` en cada fila del reporte (rubro, artículo o movimiento según el endpoint). */
export const idFromReporteRow = (row) => {
    const n = Number(row?.id);
    return Number.isFinite(n) ? n : null;
};

/** Clave de sucursal en filas del detalle por artículo (agrupado por sucursal × periodo). */
export const sucursalKeyFromReporteRow = (row) =>
    (row?.sucursal ?? row?.sucursal_nombre ?? '').toString();

export const totalFromReporteRow = (row) => {
    const n = Number(row?.total);
    return Number.isFinite(n) ? n : null;
};

export const periodoIdFromReporteRow = (row) => {
    const n = Number(row?.periodoId ?? row?.periodo_id);
    return Number.isFinite(n) ? n : null;
};

export const idsucursalFromReporteRow = (row, sucursalesCatalog) => {
    const direct = Number(row?.idsucursal ?? row?.id_sucursal);
    if (Number.isFinite(direct)) {
        return direct;
    }
    const nombre = sucursalKeyFromReporteRow(row).trim();
    if (!nombre) {
        return null;
    }
    const found = (sucursalesCatalog ?? []).find(
        (s) => (s?.nombre ?? '').toString().trim() === nombre,
    );
    const id = Number(found?.id);
    return Number.isFinite(id) ? id : null;
};

export const gastosDetalleFetchKey = ({idarticulo, idperiodo, idsucursal}) =>
    [idarticulo, idperiodo, idsucursal].filter((v) => v != null).join('-');

/**
 * Celda Periodo: concatena `(sucursales_per_periodo)` en reportes agrupados.
 * No aplica en el detalle por artículo agrupado por sucursal (`incluirSucursal`).
 */
export const periodoEtiquetaConSucursales = (descripcion, row, incluirSucursal) => {
    const base = (descripcion ?? '').toString();
    if (incluirSucursal || !base) {
        return base;
    }
    const raw = row?.sucursales_per_periodo ?? row?.sucursalesPerPeriodo;
    const n = Number(raw);
    if (!Number.isFinite(n)) {
        return base;
    }
    return base + ' (' + n + ')';
};

export const buildGastosReporteQueryParams = (submittedFilters) => {
    const params = {};
    if (!submittedFilters) {
        return params;
    }
    if (submittedFilters.periodos?.length > 0) {
        params.periodos = submittedFilters.periodos.map(p => parseInt(p.id, 10));
    }
    if (submittedFilters.sucursales?.length > 0) {
        params.sucursales = submittedFilters.sucursales.map(s => parseInt(s.id, 10));
    }
    if (submittedFilters.fecha_desde) {
        params.fecha_desde = submittedFilters.fecha_desde;
    }
    if (submittedFilters.fecha_hasta) {
        params.fecha_hasta = submittedFilters.fecha_hasta;
    }
    return params;
};

/**
 * Misma grilla: primera columna con nombre (rubro o artículo) con rowspan,
 * periodo, opcionalmente sucursal (detalle por artículo / movimientos),
 * importe y % vs siguiente.
 */
export const buildGastosTablaRows = (rows, muestraVariacion, options = {}) => {
    const {
        primeraColumnaContent,
        incluirSucursal,
        sucursalColumnContent,
        onPeriodoClick,
        getIdRubroContexto,
    } = options;
    const list = rows ?? [];
    let prevGrupoStripe = null;
    let grupoStripeBloqueIdx = -1;

    return list.map((row, idx) => {
        const grupoNombre = (row?.nombre ?? '').toString();
        const grupoStripeKey = incluirSucursal
            ? sucursalKeyFromReporteRow(row)
            : grupoNombre;
        if (grupoStripeKey !== prevGrupoStripe) {
            grupoStripeBloqueIdx++;
            prevGrupoStripe = grupoStripeKey;
        }
        const bloqueImpar = grupoStripeBloqueIdx % 2 === 1;
        const celdaStripe = bloqueImpar
            ? ' bg-slate-50 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-200 '
            : ' bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-300 ';

        const nextRow = idx < list.length - 1 ? list[idx + 1] : null;
        const grupoVariacionKey = incluirSucursal
            ? sucursalKeyFromReporteRow(row)
            : grupoNombre;
        const mismoGrupoQueSiguiente = nextRow !== null
            && (incluirSucursal
                ? sucursalKeyFromReporteRow(nextRow)
                : (nextRow?.nombre ?? '').toString()) === grupoVariacionKey;
        let variacionTexto = '';
        if (muestraVariacion) {
            if (mismoGrupoQueSiguiente) {
                variacionTexto = formatVariacionPctRespectoSiguiente(row?.importe, nextRow?.importe);
            } else {
                variacionTexto = '';
            }
        }

        let rowspanGrupo = 1;
        for (let j = idx + 1; j < list.length; j++) {
            if ((list[j]?.nombre ?? '').toString() === grupoNombre) {
                rowspanGrupo++;
            } else {
                break;
            }
        }
        const esPrimeraFilaDelGrupo =
            idx === 0 || (list[idx - 1]?.nombre ?? '').toString() !== grupoNombre;

        const content = [];
        if (esPrimeraFilaDelGrupo) {
            const primeraCelda = primeraColumnaContent
                ? primeraColumnaContent({row, idx, grupoNombre, rowspanGrupo, celdaStripe})
                : grupoNombre;
            content.push({
                key: 'grupo-' + idx,
                content: primeraCelda,
                className: celdaStripe + ' align-top font-medium text-slate-900 dark:text-slate-100 ',
                rowSpan: rowspanGrupo,
            });
        }
        const periodoLabel = periodoEtiquetaConSucursales(row?.descripcion ?? '', row, incluirSucursal);
        const idRubroCtx = typeof getIdRubroContexto === 'function' ? getIdRubroContexto(row) : null;
        const periodoIdRaw = row?.periodoId ?? row?.periodo_id;
        const periodoIdNum = Number(periodoIdRaw);
        const idRubroNum = Number(idRubroCtx);
        const periodoClickeable =
            typeof onPeriodoClick === 'function'
            && Number.isFinite(idRubroNum)
            && Number.isFinite(periodoIdNum);

        content.push(
            {
                key: 'periodo-' + idx,
                content: periodoClickeable ? (
                    <button
                        type={'button'}
                        className={
                            'w-full cursor-pointer border-0 bg-transparent p-0 text-left underline '
                            + 'text-blue-700 decoration-blue-700/40 hover:text-blue-900 '
                            + 'dark:text-blue-300 dark:decoration-blue-300/40 dark:hover:text-blue-200'
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onPeriodoClick({idrubro: idRubroNum, periodoId: periodoIdNum});
                        }}
                    >
                        {periodoLabel}
                    </button>
                ) : (
                    periodoLabel
                ),
                className: celdaStripe,
            },
        );
        if (incluirSucursal) {
            const sucursalTxt = (row?.sucursal ?? row?.sucursal_nombre ?? '').toString();
            content.push({
                key: 'sucursal-' + idx,
                content: typeof sucursalColumnContent === 'function'
                    ? sucursalColumnContent({row, idx, sucursalTxt, celdaStripe})
                    : sucursalTxt,
                className: celdaStripe,
            });
        }
        content.push(
            {
                key: 'importe-' + idx,
                content: <div className={'text-right font-semibold text-slate-900 dark:text-slate-100'}>{processNumber(Number(row?.importe ?? 0), 1, true, '$')}</div>,
                className: celdaStripe,
            },
        );
        if (muestraVariacion) {
            content.push({
                key: 'variacion-' + idx,
                content: <span className={'tabular-nums'}>{variacionTexto}</span>,
                className: celdaStripe + ' text-right text-sm text-slate-700 dark:text-slate-400 ',
            });
        }

        return {
            key: 'row-' + idx,
            content,
        };
    });
};

export const tablaHeaderDef = (muestraVariacion, options = {}) => {
    const {incluirSucursal} = options;
    const h = [
        {name: 'Gasto'},
        {name: 'Periodo'},
    ];
    if (incluirSucursal) {
        h.push({name: 'Sucursal'});
    }
    h.push({name: 'Importe', className: 'text-right'});
    if (muestraVariacion) {
        h.push({
            name: '% vs siguiente',
            className: 'text-right',
        });
    }
    return h;
};
