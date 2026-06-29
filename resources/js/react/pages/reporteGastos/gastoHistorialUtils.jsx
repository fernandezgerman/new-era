import moment from 'moment';

const FIELD_LABELS = {
    idsucursal: 'Sucursal',
    idproveedor: 'Proveedor',
    idarticulo: 'Artículo',
    idperiodo: 'Periodo liquidación',
    fechaemision: 'Fecha emisión',
    totalfactura: 'Importe',
    precio: 'Importe',
    observaciones: 'Observaciones',
};

const formatImporte = (value) => new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}).format(Number(value));

export const getGastoHistorialUserName = (audit) => {
    const user = audit?.user;
    if (!user) {
        return audit?.user_id != null ? `Usuario #${audit.user_id}` : 'Usuario desconocido';
    }
    const nombreCompleto = user.nombre_completo?.trim();
    if (nombreCompleto) {
        return nombreCompleto;
    }
    const name = [user.nombre, user.apellido].filter(Boolean).join(' ').trim();
    return name || user.name || `Usuario #${user.id}`;
};

export const getGastoHistorialGroupKey = (audit) => {
    const userId = audit?.user_id ?? audit?.user?.id ?? 'unknown';
    const createdAt = audit?.created_at
        ? moment(audit.created_at).format('YYYY-MM-DD HH:mm')
        : 'unknown';

    return `${userId}-${createdAt}`;
};

export const groupGastoHistorialAudits = (audits) => {
    const groups = [];
    const groupMap = new Map();

    for (const audit of audits) {
        const key = getGastoHistorialGroupKey(audit);
        if (!groupMap.has(key)) {
            const group = {
                key,
                userName: getGastoHistorialUserName(audit),
                createdAt: audit.created_at,
                audits: [],
            };
            groupMap.set(key, group);
            groups.push(group);
        }
        groupMap.get(key).audits.push(audit);
    }

    return groups;
};

export const getGastoHistorialGroupChanges = (audits) => audits.flatMap((audit) => getGastoHistorialChanges(audit));

export const getGastoHistorialFieldLabel = (field) => FIELD_LABELS[field] ?? field;

export const resolveGastoHistorialFieldValue = (field, value, side, metadata) => {
    if (value == null || value === '') {
        return '—';
    }

    if (field === 'idsucursal') {
        return metadata?.[`sucursal_${side}`]?.nombre ?? String(value);
    }
    if (field === 'idproveedor') {
        return metadata?.[`proveedor_${side}`]?.nombre ?? String(value);
    }
    if (field === 'idarticulo') {
        return metadata?.[`articulo_${side}`]?.nombre ?? String(value);
    }
    if (field === 'idperiodo') {
        const periodo = metadata?.[`periodo_${side}`];
        return periodo?.descripcion ?? (periodo?.id != null ? `Periodo #${periodo.id}` : String(value));
    }
    if (field === 'fechaemision') {
        const m = moment(value);
        return m.isValid() ? m.format('DD/MM/YYYY') : String(value);
    }
    if (field === 'totalfactura' || field === 'precio') {
        return formatImporte(value);
    }

    return String(value);
};

export const getGastoHistorialChanges = (audit) => {
    const oldValues = audit?.old_values ?? {};
    const newValues = audit?.new_values ?? {};
    const metadata = audit?.metadata ?? {};
    const fields = [...new Set([...Object.keys(oldValues), ...Object.keys(newValues)])];

    return fields.map((field) => ({
        field,
        label: getGastoHistorialFieldLabel(field),
        oldValue: resolveGastoHistorialFieldValue(field, oldValues[field], 'old', metadata),
        newValue: resolveGastoHistorialFieldValue(field, newValues[field], 'new', metadata),
    }));
};
