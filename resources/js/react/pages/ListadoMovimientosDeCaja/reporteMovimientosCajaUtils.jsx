import moment from 'moment';
import React from 'react';
import {processDate} from '@/utils/dates.jsx';
import {processNumber} from '@/utils/numbers.jsx';
import {ChipBlue, ChipGreen, ChipRed} from '@/components/Chip.jsx';
import {toYmdHis} from './reporteMercadoPagoUtils.jsx';

export const MOVIMIENTOS_CAJA_PER_PAGE = 100;

const idsFromEntities = (entities = []) =>
    (entities ?? [])
        .map((item) => parseInt(item?.id, 10))
        .filter((id) => Number.isFinite(id));

const inFiltro = (ids) => {
    if (!ids.length) {
        return null;
    }
    if (ids.length === 1) {
        return ids[0];
    }
    return {operador: 'in', valor: ids};
};

export const buildMovimientosCajaFiltros = ({
                                                sucursalesOrigen = [],
                                                sucursalesDestino = [],
                                                emisores = [],
                                                destinatarios = [],
                                                tiposMovimiento = [],
                                                fechaHoraDesde,
                                                fechaHoraHasta,
                                            } = {}) => {
    const filtros = {};

    const idsucursal = inFiltro(idsFromEntities(sucursalesOrigen));
    if (idsucursal != null) {
        filtros.idsucursal = idsucursal;
    }

    const idsucursaldestino = inFiltro(idsFromEntities(sucursalesDestino));
    if (idsucursaldestino != null) {
        filtros.idsucursaldestino = idsucursaldestino;
    }

    const idusuario = inFiltro(idsFromEntities(emisores));
    if (idusuario != null) {
        filtros.idusuario = idusuario;
    }

    const idusuariodestino = inFiltro(idsFromEntities(destinatarios));
    if (idusuariodestino != null) {
        filtros.idusuariodestino = idusuariodestino;
    }

    const idmotivo = inFiltro(idsFromEntities(tiposMovimiento));
    if (idmotivo != null) {
        filtros.idmotivo = idmotivo;
    }

    const fechaConditions = [];
    const desde = toYmdHis(fechaHoraDesde);
    const hasta = toYmdHis(fechaHoraHasta);
    if (desde) {
        fechaConditions.push({operador: 'mayoroigual', valor: desde});
    }
    if (hasta) {
        fechaConditions.push({operador: 'menoroigual', valor: hasta});
    }
    if (fechaConditions.length === 1) {
        filtros.fechahoramovimiento = fechaConditions[0];
    } else if (fechaConditions.length > 1) {
        filtros.fechahoramovimiento = fechaConditions;
    }

    return filtros;
};

export const validateMovimientosCajaFilters = ({
                                                   fechaHoraDesde,
                                                   fechaHoraHasta,
                                               } = {}) => {
    const fieldErrors = {};

    if (!fechaHoraDesde) {
        fieldErrors.fechaHoraDesde = 'Seleccione fecha hora desde.';
    }
    if (!fechaHoraHasta) {
        fieldErrors.fechaHoraHasta = 'Seleccione fecha hora hasta.';
    }
    if (
        fechaHoraDesde
        && fechaHoraHasta
        && !moment(fechaHoraHasta).isAfter(moment(fechaHoraDesde))
    ) {
        fieldErrors.fechaHoraHasta = 'La fecha hora hasta debe ser mayor a la fecha hora desde.';
    }

    return {
        isValid: Object.keys(fieldErrors).length === 0,
        fieldErrors,
    };
};

export const getMovimientosCajaPaginationMeta = (paginated) => {
    const rows = paginated?.data ?? [];
    return {
        currentPage: Number(paginated?.current_page) || 1,
        lastPage: Number(paginated?.last_page) || 1,
        perPage: Number(paginated?.per_page) || rows.length || MOVIMIENTOS_CAJA_PER_PAGE,
        total: Number(paginated?.total) || rows.length,
        from: Number(paginated?.from) || (rows.length > 0 ? 1 : 0),
        to: Number(paginated?.to) || rows.length,
    };
};

export const MOVIMIENTOS_CAJA_TOTALIZADO_TABLE_HEADER = [
    {name: 'Motivo (SOLO TRANSFERENCIAS ACEPTADAS)', className: 'text-left'},
    {name: 'Total', className: 'text-right'},
];

export const getMovimientosCajaTotalizadoItems = (data) => {
    if (Array.isArray(data)) {
        return data;
    }
    if (Array.isArray(data?.items)) {
        return data.items;
    }
    if (Array.isArray(data?.data)) {
        return data.data;
    }
    return [];
};

export const getMovimientosCajaTotalizadoTotal = (data, items = []) => {
    if (Number.isFinite(Number(data?.total))) {
        return Number(data.total);
    }
    return items.reduce((sum, item) => sum + (Number(item?.total) || 0), 0);
};

export const buildMovimientosCajaTotalizadoTableRows = (items = []) =>
    [...items]
        .sort((a, b) => String(a?.motivo ?? '').localeCompare(String(b?.motivo ?? ''), 'es'))
        .map((item, index) => ({
            key: item?.idmotivo ?? `motivo-${index}`,
            content: [
                {
                    content: item?.motivo ?? '—',
                    className: 'text-left',
                },
                {
                    content: processNumber(Number(item?.total) || 0, 2, false, '$'),
                    className: 'text-right',
                },
            ],
        }));

export const MOVIMIENTOS_CAJA_TABLE_HEADER = [
    /*{name: 'Sucursal', className: 'text-left'},
    {name: 'Sucursal destino', className: 'text-left'},
    {name: 'Usuario', className: 'text-left'},
    {name: 'Usuario destino', className: 'text-left'},
    {name: 'Motivo', className: 'text-left'},
    {name: 'Importe', className: 'text-right'},
    {name: 'Fecha / Hora', className: 'text-left'},
    {name: 'Estado', className: 'text-left'},*/
/*
    {name: 'Origen', className: 'text-left'},
    {name: 'Destino', className: 'text-left'},
    {name: 'Motivo', className: 'text-left'},
    {name: 'Estado', className: 'text-left'},
    {name: 'Fecha / Hora', className: 'text-left'},
    {name: 'Importe', className: 'text-right'},*/
    {name: 'Movimientos'}

];

const getUsuarioNombre = (usuario) =>
    usuario?.nombre_completo
    ?? ([usuario?.nombre, usuario?.apellido].filter(Boolean).join(' ') || null)
    ?? '—';

const getSucursalNombre = (sucursal) => sucursal?.nombre ?? '—';

const EstadoChip = ({item}) => {
    const descripcion = item?.descripcion_estado ?? '—';
    if (item?.idestado === 1) {
        return <ChipBlue>{descripcion}</ChipBlue>;
    }
    if (item?.idestado === 2) {
        return <ChipGreen>{descripcion}</ChipGreen>;
    }
    if (item?.idestado === 3) {
        return <ChipRed>{descripcion}</ChipRed>;
    }
    return descripcion;
};

export const buildMovimientosCajaTableRows = (items = []) =>
    items.map((item, index) => {
        const fechaHora = item?.fechahoramovimiento ?? null;

        const cambiosDeEstado = (item?.cambios_de_estado ?? []);

        const Comentarios = (origen) => {

            const colores = ['bg-blue-200', 'bg-green-200', 'bg-red-200'];

            const comentarios = cambiosDeEstado.reduce((acc, cambio) => {
                if ((!origen && cambio.idestado === 1) || (origen && cambio.idestado !== 1)) {
                    return acc;
                }

                acc.push({
                    fecha: cambio.fechahoraestado,
                    descripcion: cambio.descripcionestado ?? null,
                    usuario: cambio.idestado === 1 ? item.usuario.nombre_completo : item.usuario_destino.nombre_completo,
                    bgColor: colores[cambio.idestado - 1],
                })

                return acc;
            }, []);

            return comentarios.length > 0 ? comentarios[0] : null;
            /*return (<>
                        {children}
                        {(Comentarios ?? []).map((comentario, index) => {
                            return <div className={'text-xs'}>

                                <div className={'rounded-lg p-0.5 w-full mt-2 mb-2 px-2 '+comentario.bgColor}>
                                    <div className={'font-bold text-xxs mt-[-10px] w-full text-right'}>{comentario.usuario} {comentario.fecha}</div>
                                    "{comentario.descripcion}"
                                </div>
                            </div>
                        })}
                    </>);*/
        }

        const ComentarioComponent = ({comentario}) => {
            return comentario?.descripcion && (<div className={'text-xs mb-1'}>
                <div className={'rounded-lg p-0.5 w-full  px-2 ' + comentario?.bgColor}>
                    "{comentario?.descripcion}"
                </div>
            </div>);
        }
        const comentarioOrigen = Comentarios(true);
        const comentarioDestino = Comentarios(false);
        return {
            key: item?.id ?? `movimiento-${index}`,
            content: [
                {
                    content: <div className={'grid grid-cols-7'}>
                        <div className={'col-span-4 font-bold text-lg'}>{item?.motivo?.descripcion ?? '—'}</div>
                        <div className={'w-full text-right font-bold text-lg col-span-3'}>{processNumber(Number(item?.importe) || 0, 2, false, '$')}</div>

                        <div>{fechaHora ? processDate(moment(fechaHora), false, true) : '—'}</div>
                        <div className={'col-span-3 flex'}>
                            De: <span className={'ml-2 font-bold'}>{getUsuarioNombre(item?.usuario)}</span>
                            <div className={'text-xs ml-auto mr-2'}>({getSucursalNombre(item?.sucursal)} - Caja #{item?.numerocaja ?? 'N/A'})</div>
                        </div>

                        <div className={'col-span-2'}><ComentarioComponent comentario={comentarioOrigen} /></div>
                        <div className={'text-right ml-auto mr-4'}>{comentarioDestino && (<EstadoChip item={item} />)}</div>

                        <div>{comentarioDestino ? processDate(moment(comentarioDestino.fecha), false, true) : '—'}</div>
                        <div className={'col-span-3 flex'}>
                            Para: <span className={'ml-2 font-bold'}>{getUsuarioNombre(item?.usuario_destino)}</span>
                            <div
                                className={'text-xs ml-auto mr-2'}>({getSucursalNombre(item?.sucursal_destino)} - Caja #{item?.numerocajadestino ?? 'N/A'})</div>
                        </div>
                        <div className={'col-span-2'}>{comentarioDestino && (<ComentarioComponent comentario={comentarioDestino} />)}</div>
                        <div></div>
                    </div>,
                    className: 'text-left',
                }
            ],
        };

        /*
                return {
                    key: item?.id ?? `movimiento-${index}`,
                    content: [
                        {
                            content: <>
                                <b>{getUsuarioNombre(item?.usuario)}</b><br />
                                <span className={'text-xs'}>({getSucursalNombre(item?.sucursal)} - Caja #{item?.numerocaja ?? 'N/A'})</span>
                            </>,
                            className: 'text-left',
                        },
                        {
                            content:
                                <>
                                    <b>{getUsuarioNombre(item?.usuario_destino)}</b><br />
                                    <span className={'text-xs'}>({getSucursalNombre(item?.sucursal_destino)} - Caja #{item?.numerocajadestino ?? 'N/A'})</span>
                                </>,
                            className: 'text-left',
                        },
                        {
                            content: <AgregarComentarios origen={true}>{item?.motivo?.descripcion ?? '—'}</AgregarComentarios>,
                            className: 'text-left',
                        },
                        {
                            content: <EstadoChip item={item} />,
                            className: 'text-left',
                        },
                        {
                            content: fechaHora
                                ? processDate(moment(fechaHora), false, true)
                                : '—',
                            className: 'text-left',
                        },
                        {
                            content: processNumber(Number(item?.importe) || 0, 2, false, '$'),
                            className: 'text-right',
                        },
                    ],
                };*/
    });
