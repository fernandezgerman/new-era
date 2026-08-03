import React, {useCallback, useEffect, useMemo, useState} from 'react';
import moment from 'moment';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {PageHeader, RefreshIconButton} from '@/components/H.jsx';
import {Button, CancelarButton} from '@/components/Buttons.jsx';
import {DateTimePicker} from '@/components/DateTimePicker.jsx';
import {Select} from '@/components/Select.jsx';
import {SelectSucursal} from '@/components/selects/SelectSucursales.jsx';
import {SelectUsuario} from '@/components/selects/SelectUsuario.jsx';
import {SelectMotivoMovimientoCaja} from '@/components/selects/SelectMotivoMovimientoCaja.jsx';
import {AlternativeCard} from '@/components/Card.jsx';
import {LabelError} from '@/components/Label.jsx';
import {useReporteMercadoPago} from '@/dataHooks/useReporteMercadoPago.jsx';
import {useReporteMovimientosCaja} from '@/dataHooks/useReporteMovimientosCaja.jsx';
import {ReporteMercadoPagoLista} from './ReporteMercadoPagoLista.jsx';
import {ReporteMovimientosCajaLista} from './ReporteMovimientosCajaLista.jsx';
import {
    buildReporteMercadoPagoPayload,
    validateReporteMercadoPagoFilters,
} from './reporteMercadoPagoUtils.jsx';
import {
    buildMovimientosCajaFiltros,
    getMovimientosCajaPaginationMeta,
    validateMovimientosCajaFilters,
} from './reporteMovimientosCajaUtils.jsx';

const todayStartDateTime = () => moment().startOf('day').toDate();
const todayEndDateTime = () => moment().endOf('day').milliseconds(0).toDate();

export const TIPO_REPORTE_MOVIMIENTOS_CAJA = 'movimientos_caja';
export const TIPO_REPORTE_MERCADO_PAGO = 'mercado_pago';

const TIPO_REPORTE_OPTIONS = [
    {value: TIPO_REPORTE_MOVIMIENTOS_CAJA, label: 'Movimientos de caja'},
    {value: TIPO_REPORTE_MERCADO_PAGO, label: 'Mercado Pago'},
];

export const ListadoMovimientosDeCaja = () => {
    const [sucursalesOrigen, setSucursalesOrigen] = useState(null);
    const [sucursalesDestino, setSucursalesDestino] = useState([]);
    const [fechaHoraDesde, setFechaHoraDesde] = useState(todayStartDateTime);
    const [fechaHoraHasta, setFechaHoraHasta] = useState(todayEndDateTime);
    const [emisores, setEmisores] = useState([]);
    const [destinatarios, setDestinatarios] = useState([]);
    const [tiposMovimiento, setTiposMovimiento] = useState([]);
    const [tipoReporte, setTipoReporte] = useState(TIPO_REPORTE_MERCADO_PAGO);
    const [fieldErrors, setFieldErrors] = useState({});
    const [submittedFilters, setSubmittedFilters] = useState(null);
    const [page, setPage] = useState(1);

    const isMercadoPago = tipoReporte === TIPO_REPORTE_MERCADO_PAGO;
    const isMovimientosCaja = tipoReporte === TIPO_REPORTE_MOVIMIENTOS_CAJA;
    const hasSearched = submittedFilters != null;

    const reporteMercadoPagoQuery = useReporteMercadoPago({
        filters: submittedFilters,
        enabled: isMercadoPago && hasSearched,
    });

    const reporteMovimientosCajaQuery = useReporteMovimientosCaja({
        filters: submittedFilters,
        page,
        enabled: isMovimientosCaja && hasSearched,
    });

    const mercadoPagoItems = Array.isArray(reporteMercadoPagoQuery.data)
        ? reporteMercadoPagoQuery.data
        : [];
    const movimientosCajaItems = reporteMovimientosCajaQuery.data?.data ?? [];
    const paginationMeta = useMemo(
        () => getMovimientosCajaPaginationMeta(reporteMovimientosCajaQuery.data),
        [reporteMovimientosCajaQuery.data],
    );

    const activeQuery = isMercadoPago ? reporteMercadoPagoQuery : reporteMovimientosCajaQuery;
    const isLoading = activeQuery.isFetching;

    useEffect(() => {
        setPage(1);
    }, [submittedFilters]);

    const onTipoReporteChange = (value) => {
        setTipoReporte(value);
        setFieldErrors({});
        setSubmittedFilters(null);
        setPage(1);

        if (value === TIPO_REPORTE_MERCADO_PAGO) {
            setSucursalesDestino([]);
            setEmisores([]);
            setDestinatarios([]);
            setTiposMovimiento([]);
            setSucursalesOrigen((prev) => (Array.isArray(prev) ? (prev[0] ?? null) : prev));
            return;
        }

        setFechaHoraDesde(todayStartDateTime());
        setFechaHoraHasta(todayEndDateTime());
        setSucursalesOrigen((prev) => {
            if (Array.isArray(prev)) {
                return prev;
            }
            return prev ? [prev] : [];
        });
    };

    const onFechaHoraDesdeChange = useCallback((value) => {
        setFechaHoraDesde(value);
        if (!value) {
            return;
        }
        setFechaHoraHasta(moment(value).endOf('day').milliseconds(0).toDate());
    }, []);

    const onBuscar = useCallback(() => {
        if (isMercadoPago) {
            const {isValid, fieldErrors: nextErrors} = validateReporteMercadoPagoFilters({
                sucursal: sucursalesOrigen,
                fechaHoraDesde,
                fechaHoraHasta,
            });

            setFieldErrors(nextErrors);

            if (!isValid) {
                return;
            }

            setSubmittedFilters(
                buildReporteMercadoPagoPayload({
                    sucursal: sucursalesOrigen,
                    fechaHoraDesde,
                    fechaHoraHasta,
                }),
            );
            return;
        }

        const origenes = Array.isArray(sucursalesOrigen)
            ? sucursalesOrigen
            : (sucursalesOrigen ? [sucursalesOrigen] : []);

        const {isValid, fieldErrors: nextErrors} = validateMovimientosCajaFilters({
            fechaHoraDesde,
            fechaHoraHasta,
        });

        setFieldErrors(nextErrors);

        if (!isValid) {
            return;
        }

        setPage(1);
        setSubmittedFilters(
            buildMovimientosCajaFiltros({
                sucursalesOrigen: origenes,
                sucursalesDestino,
                emisores,
                destinatarios,
                tiposMovimiento,
                fechaHoraDesde,
                fechaHoraHasta,
            }),
        );
    }, [
        isMercadoPago,
        sucursalesOrigen,
        sucursalesDestino,
        emisores,
        destinatarios,
        tiposMovimiento,
        fechaHoraDesde,
        fechaHoraHasta,
    ]);

    return (
        <ErrorBoundary>
            <PageHeader>Reporte de Movimientos De Caja</PageHeader>
            <AlternativeCard>
                <div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'}>
                    <div>
                        <Select
                            options={TIPO_REPORTE_OPTIONS}
                            value={tipoReporte}
                            setValue={onTipoReporteChange}
                            label={'Tipo De Reporte'}
                            placeholder={'Seleccione tipo de reporte'}
                            allowSearch={false}
                            className={'mt-4'}
                            showClearSelection={false}
                        />
                    </div>
                    <div>
                        <SelectSucursal
                            key={isMercadoPago ? 'sucursal-origen-single' : 'sucursal-origen-multi'}
                            multiple={!isMercadoPago}
                            sucursal={sucursalesOrigen}
                            setSucursal={setSucursalesOrigen}
                            label={'Sucursal Origen'}
                            placeHolder={
                                isMercadoPago
                                    ? 'Seleccione sucursal origen'
                                    : 'Seleccione sucursales origen'
                            }
                            errorMessage={isMercadoPago ? fieldErrors.sucursal : null}
                        />
                    </div>
                    {isMovimientosCaja ? (
                        <div>
                            <SelectSucursal
                                multiple
                                sucursal={sucursalesDestino}
                                setSucursal={setSucursalesDestino}
                                label={'Sucursal Destino'}
                                placeHolder={'Seleccione sucursales destino'}
                            />
                        </div>
                    ) : null}
                    {isMovimientosCaja ? (
                        <div>
                            <SelectUsuario
                                multiple
                                usuario={emisores}
                                setUsuario={setEmisores}
                                label={'Emisor'}
                                placeHolder={'Seleccione emisores'}
                            />
                        </div>
                    ) : null}
                    {isMovimientosCaja ? (
                        <div>
                            <SelectUsuario
                                multiple
                                usuario={destinatarios}
                                setUsuario={setDestinatarios}
                                label={'Destinatario'}
                                placeHolder={'Seleccione destinatarios'}
                            />
                        </div>
                    ) : null}
                    {isMovimientosCaja ? (
                        <div>
                            <SelectMotivoMovimientoCaja
                                multiple
                                motivo={tiposMovimiento}
                                setMotivo={setTiposMovimiento}
                                label={'Tipo Movimiento'}
                                placeHolder={'Seleccione tipos de movimiento'}
                            />
                        </div>
                    ) : null}
                    <div>
                        <DateTimePicker
                            value={fechaHoraDesde}
                            setValue={onFechaHoraDesdeChange}
                            label={'Fecha Hora Desde'}
                            placeHolder={'Seleccione fecha hora desde'}
                            className={''}
                            errorMessage={fieldErrors.fechaHoraDesde ?? null}
                        />
                    </div>
                    <div>
                        <DateTimePicker
                            value={fechaHoraHasta}
                            setValue={setFechaHoraHasta}
                            label={'Fecha Hora Hasta'}
                            placeHolder={'Seleccione fecha hora hasta'}
                            className={'h-10'}
                            errorMessage={fieldErrors.fechaHoraHasta ?? null}
                        />
                    </div>
                </div>

                {activeQuery.isError ? (
                    <div className={'mt-4'}>
                        <LabelError>
                            {activeQuery.error?.message
                                ?? (isMercadoPago
                                    ? 'Error al cargar el reporte de Mercado Pago.'
                                    : 'Error al cargar el reporte de movimientos de caja.')}
                        </LabelError>
                    </div>
                ) : null}

                <div className={'mt-4 flex justify-end'}>
                    <Button
                        onClick={onBuscar}
                        disabled={isLoading}
                        className={'w-full md:w-auto'}
                    >
                        Buscar
                    </Button>
                </div>
            </AlternativeCard>

            {isMercadoPago ? (
                <>
                    <br/>
                    <AlternativeCard>
                        <div className={'mb-4 flex flex-wrap items-center justify-end gap-2 border-b border-slate-200 pb-2 dark:border-slate-700'}>
                            {hasSearched ? (
                                <RefreshIconButton
                                    onRefresh={reporteMercadoPagoQuery.refetch}
                                    loading={isLoading}
                                    className={'p-1! px-1.5!'}
                                />
                            ) : null}
                        </div>
                        <ReporteMercadoPagoLista
                            items={mercadoPagoItems}
                            isLoading={isLoading && hasSearched}
                            hasSearched={hasSearched}
                        />
                    </AlternativeCard>
                </>
            ) : null}

            {isMovimientosCaja ? (
                <>
                    <br/>
                    <AlternativeCard>
                        <div className={'mb-4 flex flex-wrap items-center justify-end gap-2 border-b border-slate-200 pb-2 dark:border-slate-700'}>
                            {hasSearched ? (
                                <RefreshIconButton
                                    onRefresh={reporteMovimientosCajaQuery.refetch}
                                    loading={isLoading}
                                    className={'p-1! px-1.5!'}
                                />
                            ) : null}
                        </div>
                        <ReporteMovimientosCajaLista
                            items={movimientosCajaItems}
                            isLoading={isLoading && hasSearched}
                            hasSearched={hasSearched}
                        />
                        <div className={'mt-4 flex flex-wrap items-center justify-between gap-3'}>
                            <p className={'text-xs text-slate-500 dark:text-slate-400'}>
                                {!hasSearched
                                    ? 'Presione Buscar para cargar los resultados.'
                                    : paginationMeta.total > 0
                                        ? `Mostrando ${paginationMeta.from}–${paginationMeta.to} de ${paginationMeta.total} registros`
                                        : 'Sin registros'}
                                {hasSearched ? (
                                    <>
                                        {' '}
                                        (página {paginationMeta.currentPage} de {paginationMeta.lastPage})
                                    </>
                                ) : null}
                            </p>
                            <div className={'flex items-center gap-2'}>
                                <CancelarButton
                                    format={'xs'}
                                    className={'mt-0! px-3! py-1.5! text-xs!'}
                                    disabled={!hasSearched || isLoading || paginationMeta.currentPage <= 1}
                                    onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                                >
                                    Anterior
                                </CancelarButton>
                                <CancelarButton
                                    format={'xs'}
                                    className={'mt-0! px-3! py-1.5! text-xs!'}
                                    disabled={
                                        !hasSearched
                                        || isLoading
                                        || paginationMeta.currentPage >= paginationMeta.lastPage
                                    }
                                    onClick={() => setPage((currentPage) => currentPage + 1)}
                                >
                                    Siguiente
                                </CancelarButton>
                            </div>
                        </div>
                    </AlternativeCard>
                </>
            ) : null}
        </ErrorBoundary>
    );
};
