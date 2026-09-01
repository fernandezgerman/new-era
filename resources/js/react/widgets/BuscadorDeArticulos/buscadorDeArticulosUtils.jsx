export const ARTICULOS_SEARCH_PER_PAGE = 20;

export const LISTA_PRECIO_ID = 2;

export const getPaginationMeta = (paginated) => {
    const rows = paginated?.data ?? [];
    return {
        currentPage: Number(paginated?.current_page) || 1,
        lastPage: Number(paginated?.last_page) || 1,
        perPage: Number(paginated?.per_page) || rows.length || ARTICULOS_SEARCH_PER_PAGE,
        total: Number(paginated?.total) || rows.length,
        from: Number(paginated?.from) || (rows.length > 0 ? 1 : 0),
        to: Number(paginated?.to) || rows.length,
    };
};

export const buildArticulosSearchFiltros = ({
    nombre = '',
    rubro = null,
    incluirInactivos = false,
} = {}) => {
    const filtros = {};
    const nombreTrim = (nombre ?? '').trim();

    if (nombreTrim.length > 0) {
        filtros.nombre = {operador: 'like', valor: nombreTrim};
    }

    if (rubro?.id) {
        filtros.idrubro = rubro.id;
    }

    if (!incluirInactivos) {
        filtros.activo = 1;
    }

    return filtros;
};

export const validateBuscadorArticulosFilters = ({nombre = '', rubro = null} = {}) => {
    const errors = {};
    const nombreTrim = (nombre ?? '').trim();
    const hasRubro = !!rubro?.id;
    const hasNombre = nombreTrim.length > 0;

    if (!hasNombre && !hasRubro) {
        errors.general = 'Debe ingresar un nombre o seleccionar un rubro.';
    }

    if (hasNombre && !hasRubro && nombreTrim.replace(/%/g, '').length < 3) {
        errors.nombre = 'Ingrese al menos 3 caracteres para buscar por nombre.';
    }

    return errors;
};

export const getArticuloPrecioLista = (articulo, idLista = LISTA_PRECIO_ID) => {
    const detalles = articulo?.lista_detalles ?? articulo?.listaDetalles ?? [];
    const detalle = detalles.find((item) => Number(item.idlista) === Number(idLista));
    return detalle?.precio ?? null;
};

export const getArticuloRubroNombre = (articulo) => articulo?.rubro?.nombre ?? '-';

export const buildPaginationItems = (currentPage, lastPage) => {
    if (lastPage <= 0) {
        return [];
    }
    if (lastPage === 1) {
        return [{type: 'page', value: 1, key: 'page-1'}];
    }

    const pages = new Set([1, lastPage]);
    for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
        if (page >= 1 && page <= lastPage) {
            pages.add(page);
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
