export const STEPS = {
    EDIT: 'edit',
    REVIEW: 'review',
    SAVED: 'saved',
};

export const SORT_KEYS = {
    ARTICULO: 'articulo',
    CANTIDAD: 'cantidad',
    PRECIO: 'precio',
    EXISTENCIA: 'Existencia',
    ACTIVO: 'activo',
};

export const DEFAULT_SORT_CONFIG = {
    key: SORT_KEYS.ARTICULO,
    direction: 'asc',
};

export const getArticuloLabel = (record) => {
    const articulo = record?.articulo;
    if (!articulo) {
        return '-';
    }
    return <><span className={'font-bold'}>{articulo.nombre}</span> <br /><span className={'text-xs'}>{articulo.codigo}</span></>;
};

export const getArticuloNombre = (record) => record?.articulo?.nombre ?? '';

export const normalizeNumber = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
};

export const numbersEqual = (left, right) => normalizeNumber(left) === normalizeNumber(right);

export const booleansEqual = (left, right) => Boolean(left) === Boolean(right);

export const getRecordValues = (record, edits = {}) => ({
    cantidad: edits.cantidad !== undefined ? edits.cantidad : record.cantidad,
    precio: edits.precio !== undefined ? edits.precio : record.precio,
    activo: edits.activo !== undefined ? edits.activo : record.activo,
});

export const isRecordNew = (record) => Boolean(record?.isNew);

export const hasValidCantidadPrecio = (values) => (
    normalizeNumber(values.cantidad) !== null
    && normalizeNumber(values.precio) !== null
);

export const isRecordPending = (record, edits) => isRecordNew(record) || isRecordChanged(record, edits);

export const getPendingRecords = (records, editsMap) => (records ?? [])
    .filter((record) => isRecordPending(record, editsMap[record.id]));

export const createNewPromocionArticulo = (articulo, idPromocion) => ({
    id: `new-${articulo.id}-${Date.now()}`,
    isNew: true,
    idpromocion: idPromocion,
    idarticulo: articulo.id,
    articulo,
    cantidad: null,
    precio: null,
    activo: true,
});

export const getArticuloPlainLabel = (record) => {
    const articulo = record?.articulo;
    if (!articulo) {
        return '-';
    }
    return `${articulo.codigo} - ${articulo.nombre}`;
};

export const validateRecordsForSiguiente = (records, editsMap) => {
    const pendingRecords = getPendingRecords(records, editsMap);

    if (pendingRecords.length === 0) {
        return {
            valid: false,
            message: 'No hay cambios para continuar.',
        };
    }

    const invalidRecords = pendingRecords.filter((record) => {
        const values = getRecordValues(record, editsMap[record.id]);
        return !hasValidCantidadPrecio(values);
    });

    if (invalidRecords.length === 0) {
        return {valid: true};
    }

    return {
        valid: false,
        message: `Complete cantidad y precio para: ${invalidRecords.map(getArticuloPlainLabel).join(', ')}`,
    };
};

export const isRecordChanged = (record, edits) => {
    if (isRecordNew(record)) {
        return false;
    }

    if (!edits) {
        return false;
    }

    const current = getRecordValues(record, edits);

    return !numbersEqual(current.cantidad, record.cantidad)
        || !numbersEqual(current.precio, record.precio)
        || !booleansEqual(current.activo, record.activo);
};

export const getChangedRecords = (records, editsMap) => (records ?? [])
    .filter((record) => isRecordPending(record, editsMap[record.id]))
    .map((record) => {
        const edits = editsMap[record.id] ?? {};
        const current = getRecordValues(record, edits);
        const isNew = isRecordNew(record);

        return {
            id: record.id,
            record,
            isNew,
            articuloLabel: getArticuloLabel(record),
            original: {
                cantidad: isNew ? null : record.cantidad,
                precio: isNew ? null : record.precio,
                activo: isNew ? null : record.activo,
            },
            current,
        };
    });

export const sortRecords = (records, sortConfig) => {
    const list = [...(records ?? [])];

    if (!sortConfig?.key) {
        return list;
    }

    const direction = sortConfig.direction === 'desc' ? -1 : 1;

    list.sort((left, right) => {
        let leftValue;
        let rightValue;

        switch (sortConfig.key) {
            case SORT_KEYS.ARTICULO:
                leftValue = getArticuloNombre(left).toLowerCase();
                rightValue = getArticuloNombre(right).toLowerCase();
                break;
            case SORT_KEYS.CANTIDAD:
                leftValue = normalizeNumber(left.cantidad) ?? 0;
                rightValue = normalizeNumber(right.cantidad) ?? 0;
                break;
            case SORT_KEYS.PRECIO:
                leftValue = normalizeNumber(left.precio) ?? 0;
                rightValue = normalizeNumber(right.precio) ?? 0;
                break;
            case SORT_KEYS.ACTIVO:
                leftValue = Boolean(left.activo) ? 1 : 0;
                rightValue = Boolean(right.activo) ? 1 : 0;
                break;
            default:
                return 0;
        }

        if (leftValue < rightValue) {
            return -1 * direction;
        }
        if (leftValue > rightValue) {
            return direction;
        }
        return 0;
    });

    return list;
};

export const formatCantidad = (value) => {
    const number = normalizeNumber(value);
    if (number === null) {
        return '-';
    }

    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
    }).format(number);
};

export const formatPrecio = (value) => {
    const number = normalizeNumber(value);
    if (number === null) {
        return '-';
    }

    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
    }).format(number);
};

export const formatActivo = (value) => (Boolean(value) ? 'Activo' : 'Inactivo');

export const toggleSortConfig = (currentSort, key) => {
    if (currentSort?.key !== key) {
        return {key, direction: 'asc'};
    }

    return {
        key,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
    };
};

export const getSortIndicator = (sortConfig, key) => {
    if (sortConfig?.key !== key) {
        return '';
    }

    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
};

export const buildPromocionArticulosSavePayload = (changedRecords, idPromocion) => ({
    articulos: changedRecords.map((item) => {
        const articulo = {
            promocion_id: Number(idPromocion),
            articulo_id: Number(item.record.idarticulo),
            porcentaje: normalizeNumber(item.record.porcentaje) ?? 0,
            cantidad: normalizeNumber(item.current.cantidad),
            precio: normalizeNumber(item.current.precio),
            activo: item.current.activo ? 1 : 0,
        };

        if (!item.isNew) {
            articulo.id = Number(item.record.id);
        }

        return articulo;
    }),
});
