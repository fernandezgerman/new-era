import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {Table} from '@/components/Table.jsx';
import {Button, CancelarButton} from '@/components/Buttons.jsx';
import {LabelError} from '@/components/Label.jsx';
import {Loading} from '@/components/Loading.jsx';
import ProveedoresImportarListasResource from '@/resources/ProveedoresImportarListas.jsx';
import {
    COLUMN_ROLE_OPTIONS,
    applyColumnRoleSelection,
    buildDefinirColumnasPayload,
    createEmptyColumnMapping,
    discoverColumnKeys,
    extractImportarListasError,
    getDetallesPaginationMeta,
    getDetallesRows,
    sortCampoKeys,
    validateColumnMapping,
} from './importarListasUtils.jsx';

const proveedoresImportarListasResource = new ProveedoresImportarListasResource();

const cardShellClass =
    'p-4 rounded-lg border border-slate-200/80 bg-white text-slate-900 shadow ' +
    'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]';

const selectHeaderClass =
    'w-full min-w-[9rem] rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs '
    + 'text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';

const ColumnRoleSelect = ({value, onChange, disabled}) => (
    <select
        className={selectHeaderClass}
        value={value ?? ''}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
    >
        {COLUMN_ROLE_OPTIONS.map((opt) => (
            <option key={opt.value || 'empty'} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);

export const ImportarListasPasoColumnas = ({importacion, onContinuarSuccess}) => {
    const idcabecera = importacion?.cabecera?.id;
    const initialDetallesPaginated = importacion?.detalles;

    const [page, setPage] = useState(() => initialDetallesPaginated?.current_page ?? 1);
    const [columnMapping, setColumnMapping] = useState({});
    const [columnKeys, setColumnKeys] = useState([]);
    const [uiError, setUiError] = useState(null);

    const detallesQuery = useQuery({
        queryKey: ['importacion-listas-detalles', idcabecera, page],
        queryFn: () => proveedoresImportarListasResource.getDetallesPreCarga(idcabecera, page),
        enabled: !!idcabecera && page !== (initialDetallesPaginated?.current_page ?? 1),
    });

    const detallesPaginated =
        page === (initialDetallesPaginated?.current_page ?? 1) && initialDetallesPaginated
            ? initialDetallesPaginated
            : detallesQuery.data;

    const paginationMeta = useMemo(
        () => getDetallesPaginationMeta(detallesPaginated),
        [detallesPaginated],
    );

    const previewRows = useMemo(
        () => getDetallesRows(detallesPaginated),
        [detallesPaginated],
    );

    useEffect(() => {
        const keysFromPage = discoverColumnKeys(initialDetallesPaginated ?? detallesPaginated);
        setColumnKeys((prev) => sortCampoKeys([...new Set([...prev, ...keysFromPage])]));
    }, [detallesPaginated, initialDetallesPaginated]);

    useEffect(() => {
        setColumnMapping((prev) => {
            const next = {...prev};
            let changed = false;
            for (const key of columnKeys) {
                if (!(key in next)) {
                    next[key] = '';
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
    }, [columnKeys]);

    const validation = useMemo(() => validateColumnMapping(columnMapping), [columnMapping]);

    const onRoleChange = useCallback((columnKey, role) => {
        setColumnMapping((prev) => applyColumnRoleSelection(prev, columnKey, role));
        setUiError(null);
    }, []);

    const continuarMutation = useMutation({
        mutationFn: (payload) =>
            proveedoresImportarListasResource.definirColumnas(idcabecera, payload),
        onSuccess: (data) => {
            setUiError(null);
            onContinuarSuccess?.(data);
        },
        onError: (err) => {
            setUiError(extractImportarListasError(err));
        },
    });

    const onContinuar = useCallback(() => {
        if (!validation.valid) {
            setUiError(validation.message);
            return;
        }
        setUiError(null);
        continuarMutation.mutate(buildDefinirColumnasPayload(columnMapping));
    }, [columnMapping, continuarMutation, validation]);

    const isLoadingDetalles = detallesQuery.isFetching && page !== (initialDetallesPaginated?.current_page ?? 1);
    const isBusy = continuarMutation.isPending || isLoadingDetalles;

    const tableHeader = useMemo(
        () =>
            columnKeys.map((campo) => ({
                key: campo,
                name: (
                    <ColumnRoleSelect
                        value={columnMapping[campo] ?? ''}
                        disabled={isBusy}
                        onChange={(role) => onRoleChange(campo, role)}
                    />
                ),
                className: 'align-top pb-2',
            })),
        [columnKeys, columnMapping, isBusy, onRoleChange],
    );

    const tableData = useMemo(
        () =>
            previewRows.map((row, idx) => ({
                key: 'preview-' + (row?.id ?? idx),
                content: columnKeys.map((campo) => ({
                    key: campo,
                    content: (row?.[campo] ?? '').toString(),
                    className: 'max-w-[14rem] truncate',
                })),
            })),
        [previewRows, columnKeys],
    );

    if (columnKeys.length === 0 && !isLoadingDetalles) {
        return (
            <div className={cardShellClass}>
                <p className={'text-base font-medium text-green-700 dark:text-green-400'}>
                    La lista se cargo correctamente
                </p>
                <p className={'mt-3 text-sm text-slate-600 dark:text-slate-400'}>
                    No se encontraron columnas con datos para definir.
                </p>
            </div>
        );
    }

    return (
        <div className={cardShellClass}>
            <p className={'mb-2 text-base font-medium text-green-700 dark:text-green-400'}>
                La lista se cargo correctamente
            </p>
            <p className={'mb-4 text-sm text-slate-600 dark:text-slate-400'}>
                Asigne la funcion de cada columna segun los registros importados.
            </p>

            <Table
                header={tableHeader}
                data={tableData}
                isLoading={isLoadingDetalles}
                emptyText={'Sin registros para mostrar.'}
                containerClassName={'overflow-x-auto'}
            />

            <div className={'mt-4 flex flex-wrap items-center justify-between gap-3'}>
                <p className={'text-xs text-slate-500 dark:text-slate-400'}>
                    {paginationMeta.total > 0
                        ? `Mostrando ${paginationMeta.from}–${paginationMeta.to} de ${paginationMeta.total} registros`
                        : 'Sin registros'}
                    {' '}
                    (pagina {paginationMeta.currentPage} de {paginationMeta.lastPage})
                </p>
                <div className={'flex items-center gap-2'}>
                    <CancelarButton
                        format={'xs'}
                        className={'mt-0! px-3! py-1.5! text-xs!'}
                        disabled={isBusy || paginationMeta.currentPage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Anterior
                    </CancelarButton>
                    <CancelarButton
                        format={'xs'}
                        className={'mt-0! px-3! py-1.5! text-xs!'}
                        disabled={isBusy || paginationMeta.currentPage >= paginationMeta.lastPage}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Siguiente
                    </CancelarButton>
                </div>
            </div>

            <p className={'mt-4 text-xs text-slate-500 dark:text-slate-400'}>
                <b>Obligatorios</b>: descripcion, precio y al menos un codigo.
            </p>

            {uiError ? (
                <div className={'mt-4'}>
                    <LabelError>{uiError}</LabelError>
                </div>
            ) : null}

            <div className={'mt-6 flex flex-wrap items-center gap-3'}>
                <Button
                    onClick={onContinuar}
                    disabled={isBusy || !validation.valid}
                    className={'w-full md:w-auto'}
                >
                    Continuar
                </Button>
                {continuarMutation.isPending ? (
                    <div className={'flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200'}>
                        <Loading/>
                        <span>Procesando columnas…</span>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
