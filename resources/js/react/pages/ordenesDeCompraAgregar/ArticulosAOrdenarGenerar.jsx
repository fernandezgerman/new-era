import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {AlternativeCard} from '@/components/Card.jsx';
import {DivCenterContentHyV} from '@/components/Containers/DivCenterContentHyV.jsx';
import {ValidationError} from '@/exceptions/Exceptions.jsx';
import OrdenesDeCompraResource from '@/resources/OrdenesDeCompra.jsx';
import {
    buildAddOrdenDeCompraPayload,
    getGrupoProveedorKey,
    groupArticulosByProveedor,
    GUARDAR_ORDEN_STATUS,
} from './ordenesDeCompraAgregarUtils.jsx';
import {ArticulosAOrdenarGenerarHeader} from './ArticulosAOrdenarGenerarHeader.jsx';
import {ArticulosAOrdenarGenerarProveedorCard} from './ArticulosAOrdenarGenerarProveedorCard.jsx';

const resource = new OrdenesDeCompraResource();

export const ArticulosAOrdenarGenerar = ({
    items = [],
    sucursalId = null,
    onSaveStateChange,
}) => {
    const [editableItems, setEditableItems] = useState(items);
    const [saveStarted, setSaveStarted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveResults, setSaveResults] = useState({});

    useEffect(() => {
        if (!saveStarted) {
            setEditableItems(items);
        }
    }, [items, saveStarted]);

    const gruposPorProveedor = useMemo(
        () => groupArticulosByProveedor(editableItems),
        [editableItems],
    );

    const handleRemoveArticulo = useCallback((articuloId) => {
        if (saveStarted) {
            return;
        }

        const id = parseInt(articuloId, 10);
        setEditableItems((prev) => prev.filter((entry) => parseInt(entry.articuloId, 10) !== id));
    }, [saveStarted]);

    const handleChangeGrupoProveedor = useCallback((grupo, nuevoProveedor) => {
        if (saveStarted || !nuevoProveedor) {
            return;
        }

        const grupoKey = getGrupoProveedorKey(grupo);

        setEditableItems((prev) => prev.map((entry) => {
            const entryKey = getGrupoProveedorKey({proveedor: entry?.proveedor});

            if (entryKey !== grupoKey) {
                return entry;
            }

            return {
                ...entry,
                proveedor: nuevoProveedor,
            };
        }));
    }, [saveStarted]);

    const executeSave = useCallback(async (saveFn, getSuccessMessage) => {
        if ((editableItems ?? []).length === 0 || isSaving || saveStarted) {
            return;
        }

        setSaveStarted(true);
        setIsSaving(true);

        const grupos = groupArticulosByProveedor(editableItems);
        const initialResults = {};

        grupos.forEach((grupo) => {
            initialResults[getGrupoProveedorKey(grupo)] = {
                status: GUARDAR_ORDEN_STATUS.PENDING,
            };
        });
        setSaveResults(initialResults);

        for (const grupo of grupos) {
            const key = getGrupoProveedorKey(grupo);
            const proveedorId = parseInt(grupo?.proveedor?.id, 10);

            if (!Number.isFinite(proveedorId) || proveedorId <= 0) {
                setSaveResults((prev) => ({
                    ...prev,
                    [key]: {
                        status: GUARDAR_ORDEN_STATUS.ERROR,
                        message: 'No se puede crear una orden sin proveedor asignado.',
                    },
                }));
                continue;
            }

            setSaveResults((prev) => ({
                ...prev,
                [key]: {status: GUARDAR_ORDEN_STATUS.SAVING},
            }));

            try {
                const payload = buildAddOrdenDeCompraPayload(grupo, sucursalId);
                const orden = await saveFn(payload);

                setSaveResults((prev) => ({
                    ...prev,
                    [key]: {
                        status: GUARDAR_ORDEN_STATUS.SUCCESS,
                        message: getSuccessMessage(orden),
                        orden,
                    },
                }));
            } catch (err) {
                setSaveResults((prev) => ({
                    ...prev,
                    [key]: {
                        status: GUARDAR_ORDEN_STATUS.ERROR,
                        message: err instanceof ValidationError
                            ? err.message
                            : (err?.message ?? 'Error al guardar la orden de compra.'),
                    },
                }));
            }
        }

        setIsSaving(false);
    }, [editableItems, isSaving, saveStarted, sucursalId]);

    const onSoloGuardar = useCallback(
        () => executeSave(
            (payload) => resource.addOrdenDeCompra(payload),
            (orden) => `Orden #${orden?.id ?? '—'} creada correctamente.`,
        ),
        [executeSave],
    );

    const onGuardarYEnviar = useCallback(
        () => executeSave(
            (payload) => resource.addAndSendOrdenDeCompra(payload),
            (orden) => `Orden #${orden?.id ?? '—'} creada y enviada por email correctamente.`,
        ),
        [executeSave],
    );

    useEffect(() => {
        onSaveStateChange?.({
            saveStarted,
            saveCompleted: saveStarted && !isSaving,
        });
    }, [saveStarted, isSaving, onSaveStateChange]);

    return (
        <ErrorBoundary>
            <ArticulosAOrdenarGenerarHeader
                onGuardarYEnviar={onGuardarYEnviar}
                onSoloGuardar={onSoloGuardar}
                disabled={(editableItems ?? []).length === 0}
                isSaving={isSaving}
                saveStarted={saveStarted}
            />

            {(editableItems ?? []).length === 0 ? (
                <AlternativeCard>
                    <DivCenterContentHyV className={'w-full p-6 text-slate-600 dark:text-slate-400'}>
                        No hay artículos con cantidad cargada.
                    </DivCenterContentHyV>
                </AlternativeCard>
            ) : (
                gruposPorProveedor.map((grupo) => {
                    const grupoKey = getGrupoProveedorKey(grupo);

                    return (
                        <ArticulosAOrdenarGenerarProveedorCard
                            key={grupoKey}
                            grupo={grupo}
                            saveStatus={saveResults[grupoKey]}
                            disabled={saveStarted}
                            onChangeProveedor={(nuevoProveedor) => handleChangeGrupoProveedor(grupo, nuevoProveedor)}
                            onRemoveArticulo={handleRemoveArticulo}
                        />
                    );
                })
            )}
        </ErrorBoundary>
    );
};
