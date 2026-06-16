import moment from 'moment';
import {processNumber} from '@/utils/numbers.jsx';

export const todayDate = () => moment().startOf('day').toDate();

export const toYmd = (date) => {
    if (!date) {
        return null;
    }
    return moment(date).format('YYYY-MM-DD');
};

export const ORDENES_DE_COMPRA_DEFAULT_SORT = 'fechahora';
export const ORDENES_DE_COMPRA_DEFAULT_SORT_DIRECTION = 'desc';

export const ORDENES_DE_COMPRA_SORT_OPTIONS = [
    {value: 'fechahora', label: 'Fecha y hora'},
    {value: 'id', label: 'Número'},
    {value: 'idproveedor', label: 'Proveedor'},
    {value: 'idsucursal', label: 'Sucursal'},
];

export const ORDENES_DE_COMPRA_SORT_DIRECTION_OPTIONS = [
    {value: 'desc', label: 'Descendente'},
    {value: 'asc', label: 'Ascendente'},
];

export const buildOrdenesDeCompraParams = (filters, page = 1, sortOptions = {}) => {
    const params = {
        page,
        per_page: 50,
        sort: sortOptions.sort ?? ORDENES_DE_COMPRA_DEFAULT_SORT,
        sort_direction: sortOptions.sortDirection ?? ORDENES_DE_COMPRA_DEFAULT_SORT_DIRECTION,
        fechaDesde: filters?.fechaDesde ?? null,
        fechaHasta: filters?.fechaHasta ?? null,
    };

    const proveedoresId = (filters?.proveedores ?? [])
        .map((p) => parseInt(p?.id, 10))
        .filter((id) => Number.isFinite(id));
    if (proveedoresId.length > 0) {
        params.proveedoresId = proveedoresId;
    }

    const sucursalesId = (filters?.sucursales ?? [])
        .map((s) => parseInt(s?.id, 10))
        .filter((id) => Number.isFinite(id));
    if (sucursalesId.length > 0) {
        params.sucursalesId = sucursalesId;
    }

    const usuarios = (filters?.usuarios ?? [])
        .map((u) => parseInt(u?.id, 10))
        .filter((id) => Number.isFinite(id));
    if (usuarios.length > 0) {
        params.usuarios = usuarios;
    }

    const articuloId = parseInt(filters?.articulo?.id, 10);
    if (Number.isFinite(articuloId)) {
        params.articulo = articuloId;
    }

    const rubroId = parseInt(filters?.rubro?.id, 10);
    if (Number.isFinite(rubroId)) {
        params.rubro = rubroId;
    }

    return params;
};

export const buildOrdenesDeCompraFilters = ({
    proveedores = [],
    sucursales = [],
    usuarios = [],
    fechaDesde,
    fechaHasta,
    articulo = null,
    rubro = null,
}) => ({
    proveedores,
    sucursales,
    usuarios,
    fechaDesde: toYmd(fechaDesde),
    fechaHasta: toYmd(fechaHasta),
    articulo,
    rubro,
});

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

export const formatOrdenFechahora = (fechahora) => {
    if (!fechahora) {
        return '—';
    }
    return moment(fechahora).format('YYYY-MM-DD HH:mm:ss');
};

export const getUsuarioNombre = (usuario) => {
    if (!usuario) {
        return '—';
    }
    if (usuario.nombre_completo) {
        return usuario.nombre_completo;
    }
    return `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim() || '—';
};

export const countOrdenArticulos = (orden) => orden?.detalles?.length ?? 0;

export const calcOrdenImporteEstimado = (orden) =>
    (orden?.detalles ?? []).reduce((acc, det) => {
        const cantidad = Number(det?.cantidad) || 0;
        const costo = Number(det?.costoestimado) || 0;
        return acc + cantidad * costo;
    }, 0);

export const ORDEN_ESTADO_EMAIL_ENVIADO = 2;

const getLatestOrdenEstado = (orden) => {
    const estados = orden?.estados ?? [];
    if (estados.length === 0) {
        return null;
    }
    return [...estados].sort((a, b) => {
        const ta = moment(a?.id).valueOf();
        const tb = moment(b?.id).valueOf();
        return tb - ta;
    })[0];
};

export const getOrdenIdestado = (orden) => {
    const idestado = parseInt(getLatestOrdenEstado(orden)?.idestado, 10);
    return Number.isFinite(idestado) ? idestado : null;
};

export const getOrdenEstadoLabel = (orden) => {
    const latest = getLatestOrdenEstado(orden);
    if (!latest) {
        return '—';
    }
    return latest?.estado?.descripcion ?? `Estado #${latest?.idestado ?? '—'}`;
};

export const downloadOrdenDeCompraPdf = (id) => {
    window.open(`/api/ordenes-de-compra/${id}/pdf`, '_blank', 'noopener,noreferrer');
};

export const formatOrdenImporte = (importe) => processNumber(importe, 2, false, '$');

export const buildArticulosMap = (articulos) => {
    const map = new Map();
    for (const articulo of articulos ?? []) {
        map.set(parseInt(articulo.id, 10), articulo);
    }
    return map;
};
