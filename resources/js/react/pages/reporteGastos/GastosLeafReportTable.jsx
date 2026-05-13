import React, {useMemo} from 'react';
import {Table} from "@/components/Table.jsx";
import {LabelError} from "@/components/Label.jsx";
import {Loading} from "@/components/Loading.jsx";
import {
    buildGastosTablaRows,
    gastosDetalleMarginXClass,
    gastosDetalleTablaMarcoClass,
    tablaHeaderDef,
} from "./gastosReporteTablaUtils.jsx";
import {GastosDetalleSeccionHeader} from "./GastosDetalleSeccionHeader.jsx";
import {useGastosRubroPeriodoContexto} from "./GastosRubroPeriodoContexto.jsx";

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
}) => {
    const openContexto = useGastosRubroPeriodoContexto()?.openContexto;

    const header = useMemo(
        () => tablaHeaderDef(muestraVariacion, {incluirSucursal: true}),
        [muestraVariacion],
    );
    const data = useMemo(
        () => buildGastosTablaRows(rows, muestraVariacion, {
            incluirSucursal: true,
            onPeriodoClick: openContexto,
            getIdRubroContexto: idrubro != null ? () => idrubro : undefined,
        }),
        [rows, muestraVariacion, openContexto, idrubro],
    );

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
