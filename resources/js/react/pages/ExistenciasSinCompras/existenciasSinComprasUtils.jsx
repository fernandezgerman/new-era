import moment from 'moment';
import {processNumber} from '@/utils/numbers.jsx';
import React from 'react';
import {processSinceDate} from "@/utils/dates.jsx";

export const EXISTENCIAS_SIN_COMPRAS_DEFAULT_DIAS = 365;

export const buildExistenciasSinComprasFilters = ({
                                                      diasUltimaCompra = EXISTENCIAS_SIN_COMPRAS_DEFAULT_DIAS,
                                                      sucursal = null,
                                                      articulo = null,
                                                      rubro = null,
                                                  } = {}) => ({
    diasUltimaCompra,
    sucursal,
    articulo,
    rubro,
});

export const buildExistenciasSinComprasParams = (filters, page = 1) => {
    const params = {
        diasUltimaCompra: filters?.diasUltimaCompra,
        page,
    };

    const articuloId = parseInt(filters?.articulo?.id, 10);
    if (Number.isFinite(articuloId)) {
        params.idarticulo = articuloId;
    }

    const sucursalId = parseInt(filters?.sucursal?.id, 10);
    if (Number.isFinite(sucursalId)) {
        params.idsucursal = sucursalId;
    }

    const rubroId = parseInt(filters?.rubro?.id, 10);
    if (Number.isFinite(rubroId)) {
        params.idrubro = rubroId;
    }

    return params;
};

export const getPaginationMeta = (paginated) => {
    const rows = paginated?.data ?? [];
    return {
        currentPage: Number(paginated?.current_page) || 1,
        lastPage: Number(paginated?.last_page) || 1,
        perPage: Number(paginated?.per_page) || rows.length || 50,
        total: Number(paginated?.total) || rows.length,
        from: Number(paginated?.from) || (rows.length > 0 ? 1 : 0),
        to: Number(paginated?.to) || rows.length,
    };
};

export const formatUltimaCompraFecha = (fechahora) => {
    if (!fechahora) {
        return '—';
    }
    return moment(fechahora).format('DD/MM/YYYY HH:mm');
};

export const formatDias = (dias) => {
    if (dias == null || dias === '') {
        return '—';
    }
    return `${dias} días`;
};

export const EXISTENCIAS_SIN_COMPRAS_TABLE_HEADER = [
    /*{name: 'Código', className: 'text-left'},*/
    {name: 'Artículo', className: 'text-left'},
    {name: 'Rubro', className: 'text-left'},
    {name: 'Sucursal', className: 'text-left'},
    {name: 'Existencia', className: 'text-right'},
    //{name: 'Última compra', className: 'text-left'},
    {name: 'Días sin compra', className: 'text-right'},
    /*{name: 'Días sin venta', className: 'text-right'},*/
];

export const buildExistenciasSinComprasTableRows = (items = []) =>
    (items ?? []).map((item) => ({
        key: `${item?.id ?? 'art'}-${item?.sucursalId ?? 'suc'}`,
        content: [
            /*{content: item?.codigo ?? '—', className: 'text-left'},*/
            {
                content: <>
                    <b>{item?.nombre ?? '—'}</b>
                    <br/> {item?.codigo}
                    <div className={'float-right mr-3 text-xxs italic text-yellow-700 dark:text-yellow-400!'}>
                        {item?.ultima_rendicion ? 'Ultimo arreglo: hace ' + processSinceDate(item?.ultima_rendicion?.fechaapertura) : 'Sin arreglos'}

                    </div>

                </>, className: 'text-left'
            },
            {content: item?.rubroNombre ?? '—', className: 'text-left'},
            {content: item?.sucursalNombre ?? '—', className: 'text-left'},
            {
                content: processNumber(Number(item?.cantidad) || 0, 0, false, '#'),
                className: 'text-right',
            },
            /* {
                 content: formatUltimaCompraFecha(item?.fechahora),
                 className: 'text-left',
             },*/
            {
                content: processSinceDate(item?.fechahora),
                className: 'text-right',
            }/*,
            {
                content: formatDias(item?.ultima_venta),
                className: 'text-right',
            },*/
        ],
    }));
