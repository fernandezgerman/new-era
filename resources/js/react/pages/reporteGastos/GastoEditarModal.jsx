import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import moment from 'moment';
import {CustomModal} from '@/components/Modal.jsx';
import {AceptarButton, CancelarButton} from '@/components/Buttons.jsx';
import {LabelError} from '@/components/Label.jsx';
import {Loading} from '@/components/Loading.jsx';
import {SelectLiquidacionPeriodos} from '@/components/selects/SelectLiquidacionPeriodos.jsx';
import {SelectArticulosRubroGastos} from '@/components/selects/SelectArticulosRubroGastos.jsx';
import {useLiquidacionPeriodos} from '@/dataHooks/useLiquidacionPeriodos.jsx';
import Resource from '@/resources/Resource.jsx';
import {processNumber} from '@/utils/numbers.jsx';
import {GastoEditarCampo} from './GastoEditarCampo.jsx';

const usuarioEtiqueta = (usuario) => {
    if (!usuario) {
        return '—';
    }
    const completo = (usuario?.nombre_completo ?? '').toString().trim();
    if (completo) {
        return completo;
    }
    return [(usuario?.nombre ?? ''), (usuario?.apellido ?? '')].join(' ').trim() || '—';
};

const formatFechaEmision = (fecha) => {
    if (!fecha) {
        return '—';
    }
    const m = moment(fecha);
    return m.isValid() ? m.format('DD/MM/YYYY') : fecha;
};

export const GastoEditarModal = ({
    isOpen,
    setIsOpen,
    compraId,
    idarticuloContexto,
    idperiodoContexto,
    onSaved,
}) => {
    const queryClient = useQueryClient();
    const {data: periodosCatalogo} = useLiquidacionPeriodos();
    const [periodo, setPeriodo] = useState(null);
    const [articulo, setArticulo] = useState(null);
    const [saveError, setSaveError] = useState(null);
    const [formReady, setFormReady] = useState(false);

    const compraQuery = useQuery({
        queryKey: ['gasto-compra-edit', compraId],
        enabled: isOpen && compraId != null,
        queryFn: async () => {
            const resource = new Resource();
            const compra = await resource.getEntity('compra', compraId, [
                'usuario',
                'sucursal',
                'proveedor',
                'periodosLiquidacion',
            ]);
            const detalles = await resource.getEntities(
                'compra-detalle',
                ['articulo'],
                {idcabecera: compraId},
            );
            return {compra, detalles: detalles ?? []};
        },
    });

    const compra = compraQuery.data?.compra;
    const detalles = compraQuery.data?.detalles ?? [];

    const detalle = useMemo(() => {
        if (!detalles.length) {
            return null;
        }
        const ctxId = Number(idarticuloContexto);
        if (Number.isFinite(ctxId)) {
            const match = detalles.find((d) => parseInt(d?.idarticulo, 10) === ctxId);
            if (match) {
                return match;
            }
        }
        return detalles[0];
    }, [detalles, idarticuloContexto]);

    const articuloInicial = useMemo(() => {
        if (detalle?.articulo) {
            return detalle.articulo;
        }
        const idArt = detalle?.idarticulo;
        if (idArt != null && idArt !== '') {
            return {
                id: idArt,
                nombre: (detalle?.articulo?.nombre ?? detalle?.nombre_articulo ?? '').toString(),
            };
        }
        return null;
    }, [detalle]);

    const periodoInicial = useMemo(() => {
        const ctx = Number(idperiodoContexto);
        const periodosCompra = compra?.periodos_liquidacion ?? compra?.periodosLiquidacion ?? [];
        if (Number.isFinite(ctx)) {
            const desdeCompra = periodosCompra.find((p) => parseInt(p?.id, 10) === ctx);
            if (desdeCompra) {
                return desdeCompra;
            }
            const desdeCatalogo = periodosCatalogo?.find((p) => parseInt(p?.id, 10) === ctx);
            if (desdeCatalogo) {
                return desdeCatalogo;
            }
        }
        if (periodosCompra.length > 0) {
            return periodosCompra[0];
        }
        return null;
    }, [compra, idperiodoContexto, periodosCatalogo]);

    useEffect(() => {
        if (!isOpen) {
            setPeriodo(null);
            setArticulo(null);
            setSaveError(null);
            setFormReady(false);
            return;
        }
        if (compraQuery.isSuccess) {
            setPeriodo(periodoInicial);
            setArticulo(articuloInicial);
            setFormReady(true);
        }
    }, [isOpen, compraQuery.isSuccess, periodoInicial, articuloInicial]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const idperiodo = parseInt(periodo?.id, 10);
            const idarticulo = parseInt(articulo?.id, 10);
            const idCompraDetalle = parseInt(detalle?.id, 10);
            if (!Number.isFinite(idperiodo) || !Number.isFinite(idarticulo) || !Number.isFinite(idCompraDetalle)) {
                throw new Error('Complete periodo y artículo.');
            }
            const payload = {
                idperiodo,
                idarticulo,
                id_compra_detalle: idCompraDetalle,
            };
            const idperiodoAnterior = parseInt(periodoInicial?.id, 10);
            if (Number.isFinite(idperiodoAnterior) && idperiodoAnterior !== idperiodo) {
                payload.idperiodo_anterior = idperiodoAnterior;
            }
            await window.axios.patch(`/api/gastos/${compraId}`, payload);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['gastos-detalle']});
            await queryClient.invalidateQueries({queryKey: ['reporte-gastos']});
            await queryClient.invalidateQueries({queryKey: ['reporte-gastos-articulo-movimientos']});
            onSaved?.();
            setIsOpen(false);
        },
        onError: (err) => {
            setSaveError(err?.response?.data?.message ?? err?.message ?? 'Error al guardar.');
        },
    });

    const onGuardar = useCallback(() => {
        setSaveError(null);
        saveMutation.mutate();
    }, [saveMutation]);

    const loading = compraQuery.isFetching;
    const loadError = compraQuery.isError
        ? (compraQuery.error?.message ?? 'Error al cargar el gasto.')
        : null;

    return (
        <CustomModal
            widthEnPX={'lg'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            titulo={'Editar gasto'}
            loading={loading || saveMutation.isPending}
            cancelButtonVisible={false}
            footer={
                <div className={'mt-4 flex justify-end gap-2'}>
                    <CancelarButton
                        disabled={saveMutation.isPending}
                        onClick={() => setIsOpen(false)}
                    >
                        Cancelar
                    </CancelarButton>
                    <AceptarButton
                        disabled={loading || saveMutation.isPending || !detalle}
                        onClick={onGuardar}
                    >
                        Guardar
                    </AceptarButton>
                </div>
            }
        >
            {loadError && <LabelError className={'mb-3'}>{loadError}</LabelError>}
            {saveError && <LabelError className={'mb-3'}>{saveError}</LabelError>}
            {loading && !compra && (
                <div className={'flex items-center gap-2 py-6 text-slate-700 dark:text-slate-200'}>
                    <Loading/>
                    <span className={'text-sm'}>Cargando…</span>
                </div>
            )}
            {compra && (
                <div className={'grid grid-cols-1 gap-6 md:grid-cols-3'}>
                    <div className={'space-y-4'}>
                        <GastoEditarCampo
                            label={'Fecha emisión'}
                            value={formatFechaEmision(compra?.fechaemision)}
                        />
                        <GastoEditarCampo label={'Usuario'} value={usuarioEtiqueta(compra?.usuario)}/>
                        <GastoEditarCampo
                            label={'Sucursal'}
                            value={(compra?.sucursal?.nombre ?? '').toString()}
                        />
                    </div>
                    <div className={'space-y-4'}>
                        <GastoEditarCampo
                            label={'Total factura'}
                            value={processNumber(Number(compra?.totalfactura ?? 0), 1, true, '$')}
                        />
                        <GastoEditarCampo
                            label={'Proveedor'}
                            value={(compra?.proveedor?.nombre ?? '').toString()}
                        />
                        <GastoEditarCampo
                            label={'Observaciones'}
                            value={(compra?.observaciones ?? '').toString()}
                        />
                    </div>
                    <GastoEditarCampo
                        label={'Precio'}
                        value={processNumber(Number(detalle?.precio ?? 0), 1, true, '$')}
                    />
                    <div className={'space-y-4'}>
                        {formReady && (
                            <>
                                <SelectLiquidacionPeriodos
                                    key={'periodo-' + compraId + '-' + (periodo?.id ?? 'none')}
                                    multiple={false}
                                    periodos={periodo}
                                    setPeriodos={setPeriodo}
                                    label={'Periodo liquidación'}
                                    placeHolder={'Seleccione periodo'}
                                />
                                <SelectArticulosRubroGastos
                                    key={'articulo-' + compraId + '-' + (articulo?.id ?? articulo?.idarticulo ?? 'none')}
                                    articulo={articulo}
                                    setArticulo={setArticulo}
                                />
                            </>
                        )}

                    </div>
                </div>
            )}
        </CustomModal>
    );
};
