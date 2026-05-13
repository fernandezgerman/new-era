import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {CustomModal} from '@/components/Modal.jsx';
import {CancelarButton} from '@/components/Buttons.jsx';
import {LabelError} from '@/components/Label.jsx';
import {Loading} from '@/components/Loading.jsx';
import {buildGastosReporteQueryParams} from './gastosReporteTablaUtils.jsx';
import moment from 'moment';
import {processNumber} from '@/utils/numbers.jsx';

const GastosRubroPeriodoContextoContext = createContext(null);

const normalizarLiquidacionPeriodoLista = (lp) => {
    if (lp == null) {
        return [];
    }
    return Array.isArray(lp) ? lp : [lp];
};

const sucursalNombre = (s) =>
    (s?.nombre ?? s?.nombre_sucursal ?? s?.descripcion ?? '').toString().trim();

const importeRepartidoUsd = (lp) => {
    const imp = Number(lp?.importerepartido);
    const cambio = Number(lp?.cambio);
    if (!Number.isFinite(imp) || !Number.isFinite(cambio) || cambio === 0) {
        return null;
    }
    return imp / cambio;
};

const GastosRubroPeriodoContextoDialog = ({
    isOpen,
    setIsOpen,
    idrubro,
    selectedPeriodoId,
    onSelectPeriodo,
    submittedFilters,
}) => {
    const baseParams = useMemo(
        () => buildGastosReporteQueryParams(submittedFilters),
        [submittedFilters],
    );

    const listaQuery = useQuery({
        queryKey: ['gastos-rubro-contexto-lista', idrubro, baseParams],
        enabled: isOpen && idrubro != null && submittedFilters != null,
        queryFn: async () => {
            const {data} = await window.axios.get(`/api/gastos/periodo/${selectedPeriodoId}/contexto`, {
                params: baseParams,
            });
            return data ?? {};
        },
    });

    const detalleQuery = useQuery({
        queryKey: ['gastos-rubro-contexto-detalle', idrubro, selectedPeriodoId, baseParams],
        enabled: isOpen && idrubro != null && selectedPeriodoId != null && submittedFilters != null,
        queryFn: async () => {
            const {data} = await window.axios.get(`/api/gastos/periodo/${selectedPeriodoId}/contexto`, {
                params: {...baseParams, periodo_id: selectedPeriodoId},
            });
            return data ?? {};
        },
    });

    const periodosLista = useMemo(() => {
        const raw = normalizarLiquidacionPeriodoLista(listaQuery.data?.liquidacionperiodo);
        return [...raw].sort((a, b) => Number(b?.id ?? 0) - Number(a?.id ?? 0));
    }, [listaQuery.data?.liquidacionperiodo]);

    const lpDetalle = detalleQuery.data?.liquidacionperiodo;
    const lpUno = Array.isArray(lpDetalle) ? lpDetalle[0] : lpDetalle;

    const sucursalesDetalle = detalleQuery.data?.sucursales ?? [];

    const usdImporteRepartido = importeRepartidoUsd(lpUno);

    const loading = listaQuery.isFetching || detalleQuery.isFetching;
    const errMsg = listaQuery.isError
        ? (listaQuery.error?.message ?? 'Error al cargar periodos.')
        : detalleQuery.isError
            ? (detalleQuery.error?.message ?? 'Error al cargar el periodo.')
            : null;

    return (
        <CustomModal
            widthEnPX={'l'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            titulo={'Contexto del rubro'}
            copete={'Periodos del contexto de filtros y detalle del periodo seleccionado.'}
            loading={loading}
            footer={
                <div className={'mt-4 flex justify-end'}>
                    <CancelarButton onClick={() => setIsOpen(false)}>Cerrar</CancelarButton>
                </div>
            }
        >
            {errMsg && <LabelError className={'mb-3'}>{errMsg}</LabelError>}
            {!errMsg && loading && periodosLista.length === 0 && (
                <div className={'flex items-center gap-2 py-4 text-slate-700 dark:text-slate-200'}>
                    <Loading/>
                    <span className={'text-sm'}>Cargando…</span>
                </div>
            )}
            {periodosLista.length > 0 && (
                <div className={'mb-6'}>
                    <div className={'mb-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-500'}>
                        Periodos
                    </div>
                    <ul className={'flex flex-wrap gap-x-4 gap-y-2'}>
                        {periodosLista.map((p) => {
                            const id = Number(p?.id);
                            const active = Number.isFinite(id) && id === selectedPeriodoId;
                            return (
                                <li key={id || p?.descripcion}>
                                    <button
                                        type={'button'}
                                        className={
                                            'cursor-pointer border-0 bg-transparent p-0 text-left underline '
                                            + 'text-blue-700 decoration-blue-700/40 hover:text-blue-900 '
                                            + 'dark:text-blue-300 dark:decoration-blue-300/40 dark:hover:text-blue-200 '
                                            + (active ? ' font-semibold ' : '')
                                        }
                                        onClick={() => {
                                            if (Number.isFinite(id)) {
                                                onSelectPeriodo(id);
                                            }
                                        }}
                                    >
                                        {(p?.descripcion ?? '—').toString()}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
            {selectedPeriodoId != null && (
                <div className={'space-y-4 border-t border-slate-200 pt-4 dark:border-slate-700'}>
                    <div>
                        <div className={'text-xs font-bold uppercase text-slate-500 dark:text-slate-500'}>
                            Descripción
                        </div>
                        <div className={'mt-1 text-slate-900 dark:text-slate-100'}>
                            {(lpUno?.descripcion ?? '—').toString()}
                        </div>
                    </div>
                    <div>
                        <div className={'text-xs font-bold uppercase text-slate-500 dark:text-slate-500'}>
                            Fecha y hora
                        </div>
                        <div className={'mt-1 text-slate-900 dark:text-slate-100'}>
                            {lpUno?.fechahora
                                ? moment(lpUno.fechahora).format('DD/MM/YYYY HH:mm')
                                : '—'}
                        </div>
                    </div>
                    <div>
                        <div className={'text-xs font-bold uppercase text-slate-500 dark:text-slate-500'}>
                            Importe repartido
                        </div>
                        <div className={'mt-1 text-slate-900 dark:text-slate-100'}>
                            {Number.isFinite(Number(lpUno?.importerepartido)) ? (
                                <>
                                    {processNumber(Number(lpUno.importerepartido), 1, true, '$')}
                                    {usdImporteRepartido != null && Number.isFinite(usdImporteRepartido) ? (
                                        <span className={'text-slate-600 dark:text-slate-400'}>
                                            {' ('}
                                            {processNumber(usdImporteRepartido, 1, true, 'USD ')}
                                            {')'}
                                        </span>
                                    ) : null}
                                </>
                            ) : (
                                '—'
                            )}
                        </div>
                    </div>
                    <div>
                        <div className={'text-xs font-bold uppercase text-slate-500 dark:text-slate-500'}>
                            Sucursales
                        </div>
                        {sucursalesDetalle.length === 0 ? (
                            <div className={'mt-1 text-sm text-slate-600 dark:text-slate-400'}>Sin sucursales.</div>
                        ) : (
                            <ul className={'mt-2 list-inside list-disc space-y-1 text-slate-900 dark:text-slate-200'}>
                                {sucursalesDetalle.map((s, i) => (
                                    <li key={s?.id ?? i}>{sucursalNombre(s) || '—'}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </CustomModal>
    );
};

export const GastosRubroPeriodoContextoProvider = ({submittedFilters, children}) => {
    const [open, setOpen] = useState(false);
    const [idrubro, setIdrubro] = useState(null);
    const [selectedPeriodoId, setSelectedPeriodoId] = useState(null);

    const openContexto = useCallback(({idrubro: rid, periodoId}) => {
        const r = Number(rid);
        const p = Number(periodoId);
        if (!Number.isFinite(r) || !Number.isFinite(p)) {
            return;
        }
        setIdrubro(r);
        setSelectedPeriodoId(p);
        setOpen(true);
    }, []);

    const value = useMemo(() => ({openContexto}), [openContexto]);

    const handleClose = useCallback((next) => {
        if (next === false) {
            setOpen(false);
            setIdrubro(null);
            setSelectedPeriodoId(null);
        }
    }, []);

    return (
        <GastosRubroPeriodoContextoContext.Provider value={value}>
            {children}
            <GastosRubroPeriodoContextoDialog
                isOpen={open}
                setIsOpen={handleClose}
                idrubro={idrubro}
                selectedPeriodoId={selectedPeriodoId}
                onSelectPeriodo={setSelectedPeriodoId}
                submittedFilters={submittedFilters}
            />
        </GastosRubroPeriodoContextoContext.Provider>
    );
};

export const useGastosRubroPeriodoContexto = () => useContext(GastosRubroPeriodoContextoContext);
