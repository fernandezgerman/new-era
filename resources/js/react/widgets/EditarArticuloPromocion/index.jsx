import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {CustomModal} from '@/components/Modal.jsx';
import {LabelError} from '@/components/Label.jsx';
import {AlertSuccess} from '@/components/Alerts.jsx';
import {AceptarButton, CancelarButton, Button} from '@/components/Buttons.jsx';
import {Loading} from '@/components/Loading.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {usePromocion} from '@/dataHooks/usePromocionArticulos.jsx';
import PromocionesResource from '@/resources/Promociones.jsx';
import Resource from '@/resources/Resource.jsx';
import {BuscadorDeArticulos} from '@/widgets/BuscadorDeArticulos/index.jsx';
import {EditarArticuloPromocionTabla} from './EditarArticuloPromocionTabla.jsx';
import {EditarArticuloPromocionResumenCambios} from './EditarArticuloPromocionResumenCambios.jsx';
import {
    DEFAULT_SORT_CONFIG,
    STEPS,
    buildPromocionArticulosSavePayload,
    createNewPromocionArticulo,
    getArticuloPlainLabel,
    getChangedRecords,
    getPendingRecords,
    isRecordChanged,
    isRecordNew,
    normalizeNumber,
    sortRecords,
    toggleSortConfig,
    validateRecordsForSiguiente,
} from './editarArticuloPromocionUtils.jsx';

const promocionesResource = new PromocionesResource();

const resetState = () => ({
    step: STEPS.EDIT,
    sortConfig: DEFAULT_SORT_CONFIG,
    editsMap: {},
    inputResetTokens: {},
    newRecords: [],
});

export const EditarArticuloPromocion = ({payload}) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [idPromocion, setIdPromocion] = useState(null);
    const [step, setStep] = useState(STEPS.EDIT);
    const [sortConfig, setSortConfig] = useState(DEFAULT_SORT_CONFIG);
    const [editsMap, setEditsMap] = useState({});
    const [inputResetTokens, setInputResetTokens] = useState({});
    const [newRecords, setNewRecords] = useState([]);
    const [isBuscadorOpen, setIsBuscadorOpen] = useState(false);
    const [buscadorSelection, setBuscadorSelection] = useState(null);
    const [buscadorError, setBuscadorError] = useState(null);
    const [focusCantidadRecordId, setFocusCantidadRecordId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [promocionArticulos, setPromocionArticulos] = useState([]);
    const [isPromocionArticulosLoading, setIsPromocionArticulosLoading] = useState(false);
    const [promocionArticulosError, setPromocionArticulosError] = useState(null);

    const promocionQuery = usePromocion(idPromocion);

    useEffect(() => {
        if (!idPromocion) {
            setPromocionArticulos([]);
            setIsPromocionArticulosLoading(false);
            setPromocionArticulosError(null);
            return;
        }

        let cancelled = false;

        const loadPromocionArticulos = async () => {
            setIsPromocionArticulosLoading(true);
            setPromocionArticulosError(null);

            try {
                const resource = new Resource();
                const data = await resource.getEntities(
                    'promocionArticulo',
                    ['articulo'],
                    {
                        idpromocion: idPromocion,
                        activo: 1,
                    },
                    {orden1: {name: 'id', direction: 'asc'}},
                    5000,
                );

                if (!cancelled) {
                    setPromocionArticulos(data ?? []);
                }
            } catch (error) {
                if (!cancelled) {
                    setPromocionArticulosError(error);
                    setPromocionArticulos([]);
                }
            } finally {
                if (!cancelled) {
                    setIsPromocionArticulosLoading(false);
                }
            }
        };

        loadPromocionArticulos();

        return () => {
            cancelled = true;
        };
    }, [idPromocion]);

    const records = promocionArticulos;
    const isLoading = promocionQuery.isLoading || isPromocionArticulosLoading;
    const isError = promocionQuery.isError || !!promocionArticulosError;

    const allRecords = useMemo(
        () => [...records, ...newRecords],
        [records, newRecords],
    );

    useEffect(() => {
        if (!payload) {
            return;
        }

        setIdPromocion(payload.promocionId);
        setIsOpen(true);
        setErrorMessage(null);
        const initialState = resetState();
        setStep(initialState.step);
        setSortConfig(initialState.sortConfig);
        setEditsMap(initialState.editsMap);
        setInputResetTokens(initialState.inputResetTokens);
        setNewRecords(initialState.newRecords);
        setIsBuscadorOpen(false);
        setBuscadorSelection(null);
        setBuscadorError(null);
        setFocusCantidadRecordId(null);
        setIsSaving(false);
    }, [payload]);

    useEffect(() => {
        if (!isError) {
            return;
        }

        setErrorMessage(
            promocionQuery.error?.message
            ?? promocionArticulosError?.message
            ?? 'No se pudo cargar la promoción.',
        );
    }, [isError, promocionQuery.error, promocionArticulosError]);

    const sortedRecords = useMemo(
        () => sortRecords(allRecords, sortConfig),
        [allRecords, sortConfig],
    );

    const pendingRecords = useMemo(
        () => getPendingRecords(allRecords, editsMap),
        [allRecords, editsMap],
    );

    const changedRecords = useMemo(
        () => getChangedRecords(allRecords, editsMap),
        [allRecords, editsMap],
    );

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setIdPromocion(null);
        const initialState = resetState();
        setStep(initialState.step);
        setSortConfig(initialState.sortConfig);
        setEditsMap(initialState.editsMap);
        setInputResetTokens(initialState.inputResetTokens);
        setNewRecords(initialState.newRecords);
        setIsBuscadorOpen(false);
        setBuscadorSelection(null);
        setBuscadorError(null);
        setFocusCantidadRecordId(null);
        setIsSaving(false);
        setErrorMessage(null);
    }, []);

    const articuloAlreadyInList = useCallback((articuloId) => (
        allRecords.some((record) => Number(record.idarticulo) === Number(articuloId))
    ), [allRecords]);

    const handleAddArticulo = useCallback((articulo) => {
        if (!articulo?.id || !idPromocion) {
            return;
        }
/*
        if (articuloAlreadyInList(articulo.id)) {
            setBuscadorError(`El artículo ${getArticuloPlainLabel({articulo})} ya está en la promoción.`);
            return;
        }*/

        const newRecord = createNewPromocionArticulo(articulo, idPromocion);
        setNewRecords((prev) => [...prev, newRecord]);
        setEditsMap((prev) => ({
            ...prev,
            [newRecord.id]: {
                cantidad: null,
                precio: null,
                activo: true,
            },
        }));
        setBuscadorError(null);
        setBuscadorSelection(null);
        setIsBuscadorOpen(false);
        setFocusCantidadRecordId(newRecord.id);
        setErrorMessage(null);
    }, [articuloAlreadyInList, idPromocion]);

    const handleBuscadorAceptar = useCallback(() => {
        if (!buscadorSelection) {
            setBuscadorError('Seleccione un artículo.');
            return;
        }

        handleAddArticulo(buscadorSelection);
    }, [buscadorSelection, handleAddArticulo]);

    const onFieldChange = useCallback((recordId, field, value) => {
        setEditsMap((prev) => {
            const record = allRecords.find((item) => item.id === recordId);
            if (!record) {
                return prev;
            }

            const currentEdits = prev[recordId] ?? {};
            const nextValue = field === 'activo'
                ? Boolean(value)
                : normalizeNumber(value);

            const nextEdits = {
                ...currentEdits,
                [field]: nextValue,
            };

            if (isRecordNew(record)) {
                return {
                    ...prev,
                    [recordId]: nextEdits,
                };
            }

            if (!isRecordChanged(record, nextEdits)) {
                const {[recordId]: removed, ...rest} = prev;
                return rest;
            }

            return {
                ...prev,
                [recordId]: nextEdits,
            };
        });
        setErrorMessage(null);
    }, [allRecords]);

    const onSortChange = useCallback((key) => {
        setSortConfig((prev) => toggleSortConfig(prev, key));
    }, []);

    const onRevertChange = useCallback((recordId) => {
        const record = allRecords.find((item) => item.id === recordId);

        if (record && isRecordNew(record)) {
            setNewRecords((prev) => prev.filter((item) => item.id !== recordId));
        }

        setEditsMap((prev) => {
            const {[recordId]: removed, ...rest} = prev;
            return rest;
        });
        setInputResetTokens((prev) => ({
            ...prev,
            [recordId]: (prev[recordId] ?? 0) + 1,
        }));
    }, [allRecords]);

    const goToReview = useCallback(() => {
        const validation = validateRecordsForSiguiente(allRecords, editsMap);

        if (!validation.valid) {
            setErrorMessage(validation.message);
            return;
        }

        setErrorMessage(null);
        setStep(STEPS.REVIEW);
    }, [allRecords, editsMap]);

    const handleSave = useCallback(async () => {
        const validation = validateRecordsForSiguiente(allRecords, editsMap);

        if (!validation.valid) {
            setErrorMessage(validation.message);
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        try {
            const payload = buildPromocionArticulosSavePayload(changedRecords, idPromocion);
            await promocionesResource.setPromocionArticulos(payload);
            setStep(STEPS.SAVED);
        } catch (error) {
            setErrorMessage(error?.message ?? 'No se pudieron guardar los cambios.');
        } finally {
            setIsSaving(false);
        }
    }, [allRecords, changedRecords, editsMap, idPromocion]);

    const modalTitle = promocionQuery.data?.descripcion ?? 'Promoción';
    const copete = step === STEPS.EDIT ? (
        <div className={'flex flex-wrap items-center justify-between gap-3'}>
            <span>Modificación de artículos de promoción</span>
            <Button
                onClick={() => {
                    setBuscadorError(null);
                    setBuscadorSelection(null);
                    setIsBuscadorOpen(true);
                }}
                disabled={isLoading}
                className={'mt-0! px-4! py-2! text-xs!'}
            >
                Agregar Articulo
            </Button>
        </div>
    ) : step === STEPS.REVIEW ? 'Revise los cambios antes de confirmar' : null;

    const footer = step === STEPS.SAVED ? (
        <AceptarButton onClick={closeModal}>
            Cerrar
        </AceptarButton>
    ) : step === STEPS.EDIT ? (
        <>
            <CancelarButton disabled={isLoading} onClick={closeModal} className={'mr-2'}>
                Cancelar
            </CancelarButton>
            <AceptarButton
                disabled={isLoading || pendingRecords.length === 0}
                onClick={goToReview}
            >
                Siguiente
            </AceptarButton>
        </>
    ) : (
        <>
            <CancelarButton disabled={isLoading || isSaving} onClick={closeModal} className={'mr-2'}>
                Cancelar
            </CancelarButton>
            <CancelarButton
                disabled={isLoading || isSaving}
                onClick={() => setStep(STEPS.EDIT)}
                className={'mr-2'}
            >
                Anterior
            </CancelarButton>
            <AceptarButton disabled={isLoading || isSaving} onClick={handleSave}>
                Aceptar
            </AceptarButton>
        </>
    );

    return (
        <ErrorBoundary>
            <CustomModal
                widthEnPX={'l'}
                isOpen={isOpen}
                setIsOpen={(open) => {
                    if (!open) {
                        closeModal();
                    }
                }}
                copete={copete}
                cancelButtonVisible={false}
                footer={footer}
                titulo={modalTitle}
                loading={isLoading || isSaving}
            >
                {errorMessage && step !== STEPS.SAVED && <LabelError className={'ml-2 mb-4'}>{errorMessage}</LabelError>}

                {(isLoading || isSaving) && step !== STEPS.SAVED && <Loading className={'my-6'} />}

                {!isLoading && !isSaving && step === STEPS.SAVED && (
                    <AlertSuccess className={'my-6 text-center text-base'}>
                        Los cambios han sido guardados
                    </AlertSuccess>
                )}

                {!isLoading && !isSaving && step === STEPS.EDIT && (
                    <div className={'max-h-[calc(100vh-320px)] overflow-y-auto pr-1'}>
                        <EditarArticuloPromocionTabla
                            records={sortedRecords}
                            editsMap={editsMap}
                            inputResetTokens={inputResetTokens}
                            sortConfig={sortConfig}
                            onSortChange={onSortChange}
                            onFieldChange={onFieldChange}
                            isLoading={isLoading}
                            focusCantidadRecordId={focusCantidadRecordId}
                            onFocusCantidadHandled={() => setFocusCantidadRecordId(null)}
                        />
                    </div>
                )}

                {!isLoading && !isSaving && step === STEPS.REVIEW && (
                    <div className={'max-h-[calc(100vh-320px)] overflow-y-auto pr-1'}>
                        <EditarArticuloPromocionResumenCambios
                            changedRecords={changedRecords}
                            onRevertChange={onRevertChange}
                        />
                    </div>
                )}
            </CustomModal>

            <CustomModal
                widthEnPX={'lg'}
                isOpen={isBuscadorOpen}
                setIsOpen={(open) => {
                    setIsBuscadorOpen(open);
                    if (!open) {
                        setBuscadorError(null);
                        setBuscadorSelection(null);
                    }
                }}
                titulo={'Buscar artículo'}
                copete={null}
                cancelButtonVisible={true}
                onAceptar={handleBuscadorAceptar}
                loading={false}
                childrenClass={'mt-2!'}
                childrenClassContainer={' max-h-[calc(100vh-220px)]! '}
            >
                {buscadorError && <LabelError className={'mb-4'}>{buscadorError}</LabelError>}
                <BuscadorDeArticulos
                    onSelectedArticuloChange={setBuscadorSelection}
                    onArticuloSelect={handleAddArticulo}
                />
            </CustomModal>
        </ErrorBoundary>
    );
};
