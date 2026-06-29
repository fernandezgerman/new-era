import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import moment from 'moment';
import {CustomModal} from '@/components/Modal.jsx';
import {AceptarButton, Button, CancelarButton} from '@/components/Buttons.jsx';
import {DatePicker} from '@/components/DatePicker.jsx';
import {Input} from '@/components/Input.jsx';
import {LabelError} from '@/components/Label.jsx';
import {Loading} from '@/components/Loading.jsx';
import {SelectLiquidacionPeriodos} from '@/components/selects/SelectLiquidacionPeriodos.jsx';
import {SelectArticulosRubroGastos} from '@/components/selects/SelectArticulosRubroGastos.jsx';
import {SelectProveedor} from '@/components/selects/SelectProveedor.jsx';
import {SelectSucursal} from '@/components/selects/SelectSucursales.jsx';
import {SelectUsuario} from '@/components/selects/SelectUsuario.jsx';
import {useLiquidacionPeriodos} from '@/dataHooks/useLiquidacionPeriodos.jsx';
import Resource from '@/resources/Resource.jsx';
import {GastoHistorialCambios} from './GastoHistorialCambios.jsx';

const parseFechaEmision = (fecha) => {
    if (!fecha) {
        return null;
    }
    const m = moment(fecha);
    return m.isValid() ? m.toDate() : null;
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
    const [fechaEmision, setFechaEmision] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [sucursal, setSucursal] = useState(null);
    const [proveedor, setProveedor] = useState(null);
    const [importe, setImporte] = useState(0);
    const [observaciones, setObservaciones] = useState('');
    const [saveError, setSaveError] = useState(null);
    const [formReady, setFormReady] = useState(false);
    const [showHistorial, setShowHistorial] = useState(false);

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
            setFechaEmision(null);
            setUsuario(null);
            setSucursal(null);
            setProveedor(null);
            setImporte(0);
            setObservaciones('');
            setSaveError(null);
            setFormReady(false);
            setShowHistorial(false);
            return;
        }
        if (compraQuery.isSuccess) {
            setPeriodo(periodoInicial);
            setArticulo(articuloInicial);
            setFechaEmision(parseFechaEmision(compra?.fechaemision));
            setUsuario(compra?.usuario ?? null);
            setSucursal(compra?.sucursal ?? null);
            setProveedor(compra?.proveedor ?? null);
            setImporte(Number(detalle?.precio ?? compra?.totalfactura ?? 0));
            setObservaciones((compra?.observaciones ?? '').toString());
            setFormReady(true);
        }
    }, [
        isOpen,
        compraQuery.isSuccess,
        compra,
        detalle,
        periodoInicial,
        articuloInicial,
    ]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const idperiodo = parseInt(periodo?.id, 10);
            const idarticulo = parseInt(articulo?.id, 10);
            const idCompraDetalle = parseInt(detalle?.id, 10);
            const idsucursal = parseInt(sucursal?.id, 10);
            const idproveedor = parseInt(proveedor?.id, 10);

            if (!Number.isFinite(idperiodo) || !Number.isFinite(idarticulo) || !Number.isFinite(idCompraDetalle)) {
                throw new Error('Complete periodo y artículo.');
            }
            if (!fechaEmision) {
                throw new Error('Complete fecha de emisión.');
            }
            if (!Number.isFinite(idsucursal)) {
                throw new Error('Seleccione sucursal.');
            }
            if (!Number.isFinite(idproveedor)) {
                throw new Error('Seleccione proveedor.');
            }
            if (!Number.isFinite(importe)) {
                throw new Error('Ingrese un importe válido.');
            }

            const gastoPayload = {
                idperiodo,
                idarticulo,
                id_compra_detalle: idCompraDetalle,
                idsucursal,
                importe,
                fecha_emision: moment(fechaEmision).format('YYYY-MM-DD'),
                id_proveedor: idproveedor,
                observaciones: observaciones ?? '',
            };
            const idperiodoAnterior = parseInt(periodoInicial?.id, 10);
            if (Number.isFinite(idperiodoAnterior) && idperiodoAnterior !== idperiodo) {
                gastoPayload.idperiodo_anterior = idperiodoAnterior;
            }

            await window.axios.patch(`/api/gastos/${compraId}`, gastoPayload);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['gasto-compra-edit', compraId]});
            await queryClient.invalidateQueries({queryKey: ['gastos-detalle']});
            await queryClient.invalidateQueries({queryKey: ['reporte-gastos']});
            await queryClient.invalidateQueries({queryKey: ['reporte-gastos-articulo-movimientos']});
            await queryClient.invalidateQueries({queryKey: ['gasto-historial', compraId]});
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
            childrenClass={showHistorial ? 'min-h-[500px]!' : 'h-[500px]!'}
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
            {compra && formReady && (
                <>
                    <div className={'grid grid-cols-1 gap-6 md:grid-cols-3'}>
                    <div>
                        <SelectLiquidacionPeriodos
                            key={'periodo-' + compraId + '-' + (periodo?.id ?? 'none')}
                            multiple={false}
                            periodos={periodo}
                            setPeriodos={setPeriodo}
                            label={'Periodo liquidación'}
                            placeHolder={'Seleccione periodo'}
                        />
                    </div>
                    <div>
                        <SelectArticulosRubroGastos
                            key={'articulo-' + compraId + '-' + (articulo?.id ?? articulo?.idarticulo ?? 'none')}
                            articulo={articulo}
                            setArticulo={setArticulo}
                        />
                    </div>
                    <div>
                        <DatePicker
                            key={'fecha-' + compraId + '-' + (fechaEmision?.getTime?.() ?? 'none')}
                            value={fechaEmision}
                            setValue={setFechaEmision}
                            label={'Fecha emisión'}
                            placeHolder={'Seleccione fecha'}
                            className={'mt-0'}
                        />
                    </div>
                    <div>
                        <SelectUsuario
                            key={'usuario-' + compraId + '-' + (usuario?.id ?? 'none')}
                            usuario={usuario}
                            disabled
                            setUsuario={setUsuario}
                            label={'Usuario que ingreso el gasto'}
                            placeHolder={'Seleccione usuario'}
                        />
                    </div>
                    <div>
                        <SelectSucursal
                            key={'sucursal-' + compraId + '-' + (sucursal?.id ?? 'none')}
                            sucursal={sucursal}
                            setSucursal={setSucursal}
                            label={'Sucursal'}
                            placeHolder={'Seleccione sucursal'}
                        />
                    </div>
                    <div>
                        <Input
                            key={'importe-' + compraId}
                            label={'Importe'}
                            type={'pesos'}
                            value={importe}
                            setValue={setImporte}
                            placeHolder={'0,00'}
                            selectOnFocus={true }
                        />
                    </div>
                    <div>
                        <SelectProveedor
                            key={'proveedor-' + compraId + '-' + (proveedor?.id ?? 'none')}
                            proveedor={proveedor}
                            setProveedor={setProveedor}
                            label={'Proveedor'}
                            placeHolder={'Seleccione proveedor'}
                        />
                    </div>
                    <div>
                        <Input
                            key={'observaciones-' + compraId}
                            label={'Observaciones'}
                            type={'text'}
                            value={observaciones}
                            setValue={setObservaciones}
                            placeHolder={'Observaciones'}
                        />
                    </div>
                    </div>

                    <div className={'mt-2 flex justify-start'}>
                        <Button
                            format={'xs'}
                            className={'mt-0! px-3! py-1.5! text-xs!'}
                            onClick={() => setShowHistorial((prev) => !prev)}
                        >
                            {showHistorial ? 'Ocultar historial de cambios' : 'Mostrar historial de cambios'}
                        </Button>
                    </div>

                    <GastoHistorialCambios compraId={compraId} enabled={showHistorial}/>
                </>
            )}
        </CustomModal>
    );
};
