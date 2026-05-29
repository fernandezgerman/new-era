export const CAMPO_KEYS = Array.from({length: 11}, (_, i) => `campo${i + 1}`);

const campoSortIndex = (campo) => {
    const n = Number(String(campo).replace('campo', ''));
    return Number.isFinite(n) ? n : 999;
};

export const sortCampoKeys = (keys) =>
    [...keys].sort((a, b) => campoSortIndex(a) - campoSortIndex(b));

export const COLUMN_ROLE_OPTIONS = [
    {value: '', label: 'No seleccionado'},
    {value: 'codigo1', label: 'codigo1'},
    {value: 'codigo2', label: 'codigo2'},
    {value: 'codigo3', label: 'codigo3'},
    {value: 'codigos_con_coma', label: 'codigos, separado con comas'},
    {value: 'descripcion', label: 'descripcion'},
    {value: 'precio', label: 'precio'},
];

/** Laravel paginator shape returned by the API for `detalles`. */
export const isDetallesPaginated = (detalles) =>
    detalles != null && Array.isArray(detalles.data);

export const getDetallesRows = (detalles) => {
    if (isDetallesPaginated(detalles)) {
        return detalles.data ?? [];
    }
    return Array.isArray(detalles) ? detalles : [];
};

export const getDetallesPaginationMeta = (detalles) => {
    const rows = getDetallesRows(detalles);
    return {
        currentPage: Number(detalles?.current_page) || 1,
        lastPage: Number(detalles?.last_page) || 1,
        perPage: Number(detalles?.per_page) || rows.length || 40,
        total: Number(detalles?.total) || rows.length,
        from: Number(detalles?.from) || (rows.length > 0 ? 1 : 0),
        to: Number(detalles?.to) || rows.length,
    };
};

export const discoverColumnKeys = (detalles) => {
    const rows = getDetallesRows(detalles);
    return CAMPO_KEYS.filter((campo) =>
        rows.some((row) => {
            const v = row?.[campo];
            return v != null && String(v).trim() !== '';
        }),
    );
};

export const createEmptyColumnMapping = (columnKeys) => {
    const mapping = {};
    for (const key of columnKeys) {
        mapping[key] = '';
    }
    return mapping;
};

export const applyColumnRoleSelection = (mapping, columnKey, role) => {
    const next = {...mapping};
    const normalizedRole = role ?? '';

    if (normalizedRole) {
        for (const key of Object.keys(next)) {
            if (key !== columnKey && next[key] === normalizedRole) {
                next[key] = '';
            }
        }
    }
    next[columnKey] = normalizedRole;
    return next;
};

export const validateColumnMapping = (mapping) => {
    const roles = Object.values(mapping ?? {}).filter(Boolean);
    const hasDescripcion = roles.includes('descripcion');
    const hasPrecio = roles.includes('precio');
    const hasCodigo =
        roles.includes('codigo1') || roles.includes('codigo2') || roles.includes('codigo3') || roles.includes('codigos_con_coma');

    if (!hasDescripcion || !hasPrecio || !hasCodigo) {
        return {
            valid: false,
            message:
                'Debe asignar descripcion, precio y al menos un codigo.',
        };
    }
    return {valid: true, message: null};
};

export const buildDefinirColumnasPayload = (mapping) => {
    const payload = {
        precio: null,
        descripcion: null,
        codigo1: null,
        codigo2: null,
        codigo3: null,
        codigos_con_coma: null
    };

    for (const [campo, role] of Object.entries(mapping ?? {})) {
        if (role && Object.prototype.hasOwnProperty.call(payload, role)) {
            payload[role] = campo;
        }
    }

    return payload;
};

export const formatListaPrecio = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) {
        return value != null && value !== '' ? String(value) : '—';
    }
    return n.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
};

export const buildListaDetalleTableData = (rows) =>
    (rows ?? []).map((row, idx) => ({
        key: 'lista-det-' + (row?.id ?? idx),
        content: [
            {
                key: 'codigo',
                content: row?.articulo?.codigo ?? '—',
                className: 'whitespace-nowrap',
            },
            {
                key: 'articulo',
                content: row?.articulo?.nombre ?? row?.articulo?.descripcion ?? '—',
                className: 'max-w-[16rem] truncate',
            },
            {
                key: 'descripcion-proveedor',
                content: row?.descripciondelproveedor ?? '—',
                className: 'max-w-[16rem] truncate',
            },
            {
                key: 'precio',
                content: formatListaPrecio(row?.precio),
                className: 'whitespace-nowrap text-right',
            },
        ],
    }));

export const LISTA_DETALLE_TABLE_HEADER = [
    {key: 'codigo', name: 'Código', className: 'text-left'},
    {key: 'articulo', name: 'Artículo', className: 'text-left'},
    {key: 'descripcion-proveedor', name: 'Descripción proveedor', className: 'text-left'},
    {key: 'precio', name: 'Precio', className: 'text-right'},
];

export const extractImportarListasError = (err) =>
    err?.response?.data?.message
    ?? err?.response?.data?.errors?.file?.[0]
    ?? err?.message
    ?? 'Ocurrió un error inesperado.';
