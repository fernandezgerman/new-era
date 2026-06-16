import React, {useCallback, useMemo, useState} from 'react';
import {faEnvelope, faFilePdf, faMagnifyingGlass, faXmark} from '@fortawesome/free-solid-svg-icons';
import {IconButton} from '@/components/Buttons.jsx';
import {AlertDanger} from '@/components/Alerts.jsx';
import OrdenesDeCompraResource from '@/resources/OrdenesDeCompra.jsx';
import {OrdenesDeCompraDetalleTabla} from './OrdenesDeCompraDetalleTabla.jsx';
import {
    calcOrdenImporteEstimado,
    countOrdenArticulos,
    downloadOrdenDeCompraPdf,
    getOrdenIdestado,
    getUsuarioNombre,
    ORDEN_ESTADO_EMAIL_ENVIADO,
} from './ordenesDeCompraUtils.jsx';
import {ChipBlue, ChipGreen, ChipOrange} from '@/components/Chip.jsx';
import {processDate} from '@/utils/dates.jsx';
import moment from 'moment';
import {processNumber} from '@/utils/numbers.jsx';

const rowShellClass =
    'mb-3 rounded-lg border border-slate-300 bg-slate-700 px-6 py-3 text-white shadow '
    + 'dark:border-slate-600 dark:bg-black!';

const rowEmailEnviadoClass =
    'mb-3 rounded-lg border border-green-400 bg-green-400 px-6 py-3 text-slate-900 shadow '
    + 'dark:border-green-800 bg-green-900! text-white!';

const resource = new OrdenesDeCompraResource();

export const OrdenesDeCompraLista = ({ordenes = [], articulosCatalog = [], isLoading = false, onRefresh}) => {
    const [expandedOrdenIds, setExpandedOrdenIds] = useState(() => new Set());
    const [sendingEmailIds, setSendingEmailIds] = useState(() => new Set());
    const [emailErrors, setEmailErrors] = useState({});

    const toggleOrdenExpanded = useCallback((id) => {
        setExpandedOrdenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const handleSendEmail = useCallback(async (id) => {
        setEmailErrors((prev) => {
            const next = {...prev};
            delete next[id];
            return next;
        });

        setSendingEmailIds((prev) => new Set(prev).add(id));

        try {
            await resource.sendOrdenDeCompraEmail(id);
            await onRefresh?.();
        } catch (err) {
            setEmailErrors((prev) => ({
                ...prev,
                [id]: err?.message ?? 'Error al enviar el email de la orden de compra.',
            }));
        } finally {
            setSendingEmailIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    }, [onRefresh]);

    const rows = useMemo(
        () => (ordenes ?? []).map((orden) => {
            const id = parseInt(orden?.id, 10);
            const cantidadArticulos = countOrdenArticulos(orden);
            const importeEstimado = calcOrdenImporteEstimado(orden);
            const detalleAbierto = expandedOrdenIds.has(id);
            const isEmailEnviado = getOrdenIdestado(orden) === ORDEN_ESTADO_EMAIL_ENVIADO;
            const isSendingEmail = sendingEmailIds.has(id);
            const emailError = emailErrors[id];

            return (
                <div
                    key={'orden-' + id}
                    className={(isEmailEnviado ? rowEmailEnviadoClass : rowShellClass) + (isLoading ? ' opacity-60' : '')}
                >
                    <div className={'flex items-start justify-between gap-4'}>
                        <div className={'min-w-0 flex-1'}>
                            <div className={'text-lg font-bold uppercase tracking-wide'}>
                                #{id} - {orden?.proveedor?.nombre ?? '—'}
                            </div>
                            <div className={'flex flex-wrap gap-2'}>
                                <ChipBlue>{orden?.sucursal?.nombre ?? '—'}</ChipBlue>
                                <ChipOrange>{getUsuarioNombre(orden?.usuario)}</ChipOrange>
                                {isEmailEnviado ? (
                                    <ChipGreen>
                                        Email enviado
                                    </ChipGreen>
                                ) : null}
                            </div>
                            <div className={'mt-1 flex flex-wrap items-center gap-2 text-sm'}>
                                <span>#{cantidadArticulos} articulos</span>
                                <IconButton
                                    icon={detalleAbierto ? faXmark : faMagnifyingGlass}
                                    className={'m-0! inline-flex! px-1.5! py-0.5! text-xs!'}
                                    title={detalleAbierto ? 'Cerrar detalle' : 'Ver detalle de artículos'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleOrdenExpanded(id);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={'shrink-0 text-right'}>
                            <div className={'text-sm italic ' + (isEmailEnviado ? 'text-slate-400' : 'text-slate-400')}>
                                {processDate(moment(orden?.fechahora))}
                            </div>
                            <div className={'mt-2 text-xl font-bold'}>
                                {processNumber(importeEstimado, 2, false, '$')}
                            </div>
                            <div className={'mt-1 flex justify-end gap-1'}>
                                <IconButton
                                    icon={faEnvelope}
                                    className={'m-0! inline-flex! px-1.5! py-1! text-sm!' + (isSendingEmail ? ' opacity-60 cursor-not-allowed' : '')}
                                    title={'Enviar email'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!isSendingEmail) {
                                            handleSendEmail(id);
                                        }
                                    }}
                                />
                                <IconButton
                                    icon={faFilePdf}
                                    className={'m-0! inline-flex! px-1.5! py-1! text-sm!'}
                                    title={'Descargar PDF'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        downloadOrdenDeCompraPdf(id);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {emailError ? (
                        <AlertDanger className={'mt-3 mb-0!'}>
                            {emailError}
                        </AlertDanger>
                    ) : null}

                    {detalleAbierto ? (
                        <OrdenesDeCompraDetalleTabla
                            detalles={orden?.detalles}
                            articulosCatalog={articulosCatalog}
                        />
                    ) : null}
                </div>
            );
        }),
        [articulosCatalog, emailErrors, expandedOrdenIds, handleSendEmail, isLoading, ordenes, sendingEmailIds, toggleOrdenExpanded],
    );

    if (!isLoading && rows.length === 0) {
        return (
            <p className={'py-8 text-center text-sm text-slate-600 dark:text-slate-400'}>
                No se encontraron registros.
            </p>
        );
    }

    return <div className={'space-y-0'}>{rows}</div>;
};
