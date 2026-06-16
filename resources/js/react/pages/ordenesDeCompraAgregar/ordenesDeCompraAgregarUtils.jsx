export const ARTICULOS_A_ORDENAR_DEFAULT_PAGE = 1;
export const ARTICULOS_A_ORDENAR_DEFAULT_PER_PAGE = 50;
export const ARTICULOS_A_ORDENAR_DEFAULT_SOLO_STOCK_ACTIVO = true;
export const ARTICULOS_A_ORDENAR_DEFAULT_SOLO_VENDIDOS = false;

export const validateArticulosAOrdenarFilters = ({
    rubros = [],
    sucursal = null,
    diasventas = null,
}) => {
    const errors = {};

    const rubrosIds = (rubros ?? [])
        .map((r) => parseInt(r?.id, 10))
        .filter((id) => Number.isFinite(id));

    if (rubrosIds.length === 0) {
        errors.rubros = 'Seleccione al menos un rubro.';
    }

    const sucursalId = parseInt(sucursal?.id, 10);
    if (!Number.isFinite(sucursalId)) {
        errors.sucursal = 'Seleccione una sucursal.';
    }

    const dias = parseInt(diasventas, 10);
    if (!Number.isFinite(dias) || dias < 1) {
        errors.diasventas = 'Ingrese una cantidad de días mayor o igual a 1.';
    }

    return errors;
};

export const buildArticulosAOrdenarFilters = ({
    rubros = [],
    sucursal = null,
    diasventas = null,
    marcas = [],
    soloStockActivo = ARTICULOS_A_ORDENAR_DEFAULT_SOLO_STOCK_ACTIVO,
    soloVendidos = ARTICULOS_A_ORDENAR_DEFAULT_SOLO_VENDIDOS,
}) => ({
    rubros: rubros ?? [],
    sucursal,
    diasventas: parseInt(diasventas, 10),
    marcas: marcas ?? [],
    soloStockActivo: soloStockActivo ? 1 : 0,
    soloVendidos: soloVendidos ? 1 : 0,
});

export const buildArticulosAOrdenarParams = (filters, {
    page = ARTICULOS_A_ORDENAR_DEFAULT_PAGE,
    perPage = ARTICULOS_A_ORDENAR_DEFAULT_PER_PAGE,
} = {}) => {
    if (!filters) {
        return null;
    }

    const rubros = (filters.rubros ?? [])
        .map((r) => parseInt(r?.id, 10))
        .filter((id) => Number.isFinite(id));

    const sucursal = parseInt(filters.sucursal?.id, 10);
    const diasventas = parseInt(filters.diasventas, 10);

    const marcas = (filters.marcas ?? [])
        .map((m) => parseInt(m?.id, 10))
        .filter((id) => Number.isFinite(id));

    const params = {
        rubros,
        sucursal,
        diasventas,
        soloStockActivo: filters.soloStockActivo ? 1 : 0,
        soloVendidos: filters.soloVendidos ? 1 : 0,
        page,
        per_page: perPage,
    };

    if (marcas.length > 0) {
        params.marcas = marcas;
    }

    return params;
};

export const getArticulosAOrdenarPaginationMeta = (response) => {
    const rows = response?.articulos ?? [];

    return {
        currentPage: Number(response?.current_page) || ARTICULOS_A_ORDENAR_DEFAULT_PAGE,
        lastPage: Number(response?.last_page) || 1,
        perPage: Number(response?.per_page) || rows.length || ARTICULOS_A_ORDENAR_DEFAULT_PER_PAGE,
        total: Number(response?.total) || rows.length,
        from: Number(response?.from) || (rows.length > 0 ? 1 : 0),
        to: Number(response?.to) || rows.length,
    };
};

export const formatBooleanFilter = (value) => (value ? 'Sí' : 'No');

export const formatEntityList = (entities = [], fallback = '—') => {
    const labels = (entities ?? [])
        .map((entity) => entity?.nombre)
        .filter(Boolean);

    return labels.length > 0 ? labels.join(', ') : fallback;
};

export const getArticuloItemId = (item) => item?.articulos?.id ?? null;

export const getProveedoresOpciones = (item) => {
    const map = new Map();

    for (const compraDetalle of item?.proveedores?.ultimas_compras ?? []) {
        const proveedor = compraDetalle?.compra?.proveedor;
        if (proveedor?.id != null) {
            map.set(parseInt(proveedor.id, 10), proveedor);
        }
    }

    for (const listaPrecio of item?.proveedores?.listas_precios ?? []) {
        const proveedor = listaPrecio?.proveedor_lista?.proveedor;
        if (proveedor?.id != null) {
            map.set(parseInt(proveedor.id, 10), proveedor);
        }
    }

    return Array.from(map.values()).sort((a, b) =>
        (a?.nombre ?? '').localeCompare(b?.nombre ?? '', 'es'),
    );
};

export const getDefaultProveedor = (item, sucursalId) => {
    if(item.proveedores.default) return item.proveedores.default;

    if(item.proveedores.recomendado) return item.proveedores.recomendado;

    const ultimaCompra = item?.ultima_compra;
    if (ultimaCompra?.compra?.proveedor) {
        return ultimaCompra.compra.proveedor;
    }

    const sucursalMatch = (item?.proveedores?.ultimas_compras ?? []).find(
        (detalle) => parseInt(detalle?.compra?.idsucursal, 10) === parseInt(sucursalId, 10),
    );
    if (sucursalMatch?.compra?.proveedor) {
        return sucursalMatch.compra.proveedor;
    }

    return getProveedoresOpciones(item)[0] ?? null;
};

export const buildInitialRowEdits = (articulos = [], sucursalId = null) => {
    const edits = {};

    for (const item of articulos) {
        const id = getArticuloItemId(item);
        if (id == null) {
            continue;
        }

        edits[id] = {
            proveedor: getDefaultProveedor(item, sucursalId),
            cantidad: null,
        };
    }

    return edits;
};

export const hasCantidadSet = (rowEdit) => {
    const cantidad = parseInt(rowEdit?.cantidad, 10);
    return Number.isFinite(cantidad) && cantidad > 0;
};

export const buildPageRowEdits = (articulos = [], sucursalId = null, persistedRowEdits = {}) => {
    const defaults = buildInitialRowEdits(articulos, sucursalId);
    const merged = {...defaults};

    for (const item of articulos) {
        const id = getArticuloItemId(item);
        const persisted = persistedRowEdits[id];

        if (persisted && hasCantidadSet(persisted)) {
            merged[id] = {
                ...defaults[id],
                ...persisted,
            };
        }
    }

    return merged;
};

export const parseExistenciaCantidad = (existencias) => {
    const cantidad = parseInt(existencias?.cantidad, 10);
    return Number.isFinite(cantidad) ? cantidad : 0;
};

export const scrollElementToContainerTop = (element, container, offset = 8) => {
    if (!element || !container) {
        return;
    }

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - offset;

    container.scrollTo({
        top: Math.max(0, scrollTop) - 30,
        behavior: 'smooth',
    });
};

export const AGREGAR_ORDEN_STEPS = {
    CARGAR: 'cargar',
    GENERAR: 'generar',
};

export const buildPaginationItems = (currentPage, lastPage) => {
    if (lastPage <= 0) {
        return [];
    }
    if (lastPage === 1) {
        return [{type: 'page', value: 1, key: 'page-1'}];
    }

    const pages = new Set([1, lastPage]);
    for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
        if (i >= 1 && i <= lastPage) {
            pages.add(i);
        }
    }

    const sorted = [...pages].sort((a, b) => a - b);
    const items = [];
    let previous = 0;

    for (const page of sorted) {
        if (page - previous > 1) {
            items.push({type: 'ellipsis', key: `ellipsis-${previous}-${page}`});
        }
        items.push({type: 'page', value: page, key: `page-${page}`});
        previous = page;
    }

    return items;
};

export const getPersistedArticulosConCantidad = (persistedRowEdits = {}) =>
    Object.entries(persistedRowEdits)
        .filter(([, edit]) => hasCantidadSet(edit))
        .map(([articuloId, edit]) => ({
            articuloId: parseInt(articuloId, 10),
            cantidad: edit.cantidad,
            proveedor: edit.proveedor,
            item: edit.item ?? null,
        }))
        .sort((a, b) =>
            (a.item?.articulos?.nombre ?? '').localeCompare(b.item?.articulos?.nombre ?? '', 'es'),
        );

export const countPersistedArticulosConCantidad = (persistedRowEdits = {}) =>
    getPersistedArticulosConCantidad(persistedRowEdits).length;

export const groupArticulosByProveedor = (items = []) => {
    const groups = new Map();

    for (const entry of items ?? []) {
        const proveedorId = parseInt(entry?.proveedor?.id, 10);
        const groupKey = Number.isFinite(proveedorId) ? proveedorId : 'sin-proveedor';

        if (!groups.has(groupKey)) {
            groups.set(groupKey, {
                proveedor: entry?.proveedor ?? {id: null, nombre: 'Sin proveedor'},
                items: [],
                totalCantidad: 0,
            });
        }

        const group = groups.get(groupKey);
        group.items.push(entry);
        group.totalCantidad += Number(entry?.cantidad) || 0;
    }

    return [...groups.values()].sort((a, b) =>
        (a.proveedor?.nombre ?? '').localeCompare(b.proveedor?.nombre ?? '', 'es'),
    );
};

export const getGrupoProveedorKey = (grupo) => {
    const proveedorId = parseInt(grupo?.proveedor?.id, 10);
    return Number.isFinite(proveedorId) ? String(proveedorId) : 'sin-proveedor';
};

export const buildAddOrdenDeCompraPayload = (grupo, sucursalId, observaciones = null) => ({
    idproveedor: parseInt(grupo?.proveedor?.id, 10),
    idsucursal: parseInt(sucursalId, 10),
    observaciones,
    detalles: (grupo?.items ?? []).map((entry) => ({
        idarticulo: entry.articuloId,
        cantidad: Number(entry?.cantidad) || 0,
        costoestimado: Number(entry?.item?.costo_con_impuestos) || 0,
    })),
});

export const GUARDAR_ORDEN_STATUS = {
    PENDING: 'pending',
    SAVING: 'saving',
    SUCCESS: 'success',
    ERROR: 'error',
};
