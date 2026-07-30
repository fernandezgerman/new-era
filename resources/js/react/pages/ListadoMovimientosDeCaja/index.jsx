import React, {useCallback, useState} from 'react';
import moment from 'moment';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {PageHeader, RefreshIconButton} from '@/components/H.jsx';
import {Button} from '@/components/Buttons.jsx';
import {DateTimePicker} from '@/components/DateTimePicker.jsx';
import {Select} from '@/components/Select.jsx';
import {SelectSucursal} from '@/components/selects/SelectSucursales.jsx';
import {SelectUsuario} from '@/components/selects/SelectUsuario.jsx';
import {SelectMotivoMovimientoCaja} from '@/components/selects/SelectMotivoMovimientoCaja.jsx';
import {AlternativeCard} from '@/components/Card.jsx';
import {LabelError} from '@/components/Label.jsx';
import {useReporteMercadoPago} from '@/dataHooks/useReporteMercadoPago.jsx';
import {ReporteMercadoPagoLista} from './ReporteMercadoPagoLista.jsx';
import {
    buildReporteMercadoPagoPayload,
    validateReporteMercadoPagoFilters,
} from './reporteMercadoPagoUtils.jsx';

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

    const isMercadoPago = tipoReporte === TIPO_REPORTE_MERCADO_PAGO;
    const hasSearched = submittedFilters != null;

    const reporteQuery = useReporteMercadoPago({
        filters: submittedFilters,
        enabled: isMercadoPago && hasSearched,
    });

    const items = Array.isArray(reporteQuery.data) ? reporteQuery.data : [];
    const isLoading = reporteQuery.isFetching;

    const onTipoReporteChange = (value) => {
        setTipoReporte(value);
        setFieldErrors({});
        setSubmittedFilters(null);

        if (value === TIPO_REPORTE_MERCADO_PAGO) {
            setSucursalesDestino([]);
            setEmisores([]);
            setDestinatarios([]);
            setTiposMovimiento([]);
            setSucursalesOrigen((prev) => (Array.isArray(prev) ? (prev[0] ?? null) : prev));
            return;
        }

        setSucursalesOrigen((prev) => {
            if (Array.isArray(prev)) {
                return prev;
            }
            return prev ? [prev] : [];
        });
    };

    const onBuscar = useCallback(() => {
        if (!isMercadoPago) {
            return;
        }

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
    }, [isMercadoPago, sucursalesOrigen, fechaHoraDesde, fechaHoraHasta]);

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
                    {!isMercadoPago ? (
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
                    {!isMercadoPago ? (
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
                    {!isMercadoPago ? (
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
                    {!isMercadoPago ? (
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
                            setValue={setFechaHoraDesde}
                            label={'Fecha Hora Desde'}
                            placeHolder={'Seleccione fecha hora desde'}
                            className={''}
                            errorMessage={isMercadoPago ? fieldErrors.fechaHoraDesde : null}
                        />
                    </div>
                    <div>
                        <DateTimePicker
                            value={fechaHoraHasta}
                            setValue={setFechaHoraHasta}
                            label={'Fecha Hora Hasta'}
                            placeHolder={'Seleccione fecha hora hasta'}
                            className={'h-10'}
                            errorMessage={isMercadoPago ? fieldErrors.fechaHoraHasta : null}
                        />
                    </div>
                </div>

                {isMercadoPago && reporteQuery.isError ? (
                    <div className={'mt-4'}>
                        <LabelError>
                            {reporteQuery.error?.message ?? 'Error al cargar el reporte de Mercado Pago.'}
                        </LabelError>
                    </div>
                ) : null}

                {isMercadoPago ? (
                    <div className={'mt-4 flex justify-end'}>
                        <Button
                            onClick={onBuscar}
                            disabled={isLoading}
                            className={'w-full md:w-auto'}
                        >
                            Buscar
                        </Button>
                    </div>
                ) : null}
            </AlternativeCard>

            {isMercadoPago ? (
                <>
                    <br/>
                    <AlternativeCard>
                        <div className={'mb-4 flex flex-wrap items-center justify-end gap-2 border-b border-slate-200 pb-2 dark:border-slate-700'}>
                            {hasSearched ? (
                                <RefreshIconButton
                                    onRefresh={reporteQuery.refetch}
                                    loading={isLoading}
                                    className={'p-1! px-1.5!'}
                                />
                            ) : null}
                        </div>
                        <ReporteMercadoPagoLista
                            items={items}
                            isLoading={isLoading && hasSearched}
                            hasSearched={hasSearched}
                        />
                    </AlternativeCard>
                </>
            ) : null}
        </ErrorBoundary>
    );
};
