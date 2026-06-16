import React, {useMemo} from 'react';
import {faFilePdf} from '@fortawesome/free-solid-svg-icons';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {AlternativeCard} from '@/components/Card.jsx';
import {Table} from '@/components/Table.jsx';
import {Label} from '@/components/Label.jsx';
import {DeleteIconButton, IconButton} from '@/components/Buttons.jsx';
import {AlertDanger, AlertSuccess} from '@/components/Alerts.jsx';
import {ChipRed} from '@/components/Chip.jsx';
import {Loading} from '@/components/Loading.jsx';
import {processNumber} from '@/utils/numbers.jsx';
import {parseExistenciaCantidad, GUARDAR_ORDEN_STATUS} from './ordenesDeCompraAgregarUtils.jsx';
import {ArticulosAOrdenarProveedorSelect} from './ArticulosAOrdenarProveedorSelect.jsx';

const PROVEEDOR_HEADER = [
    {name: 'Artículo', className: 'text-left'},
    {name: 'Rubro / Marca', className: 'text-left'},
    {name: 'Existencia', className: 'text-right'},
    {name: 'Cantidad', className: 'text-right'},
    {name: '', className: 'w-10'},
];

const buildProveedorTableData = (items = [], {onRemoveArticulo, disabled = false} = {}) => {
    let totalCantidad = 0;

    const rows = (items ?? []).map((entry) => {
        const articulo = entry?.item?.articulos ?? {};
        const cantidad = Number(entry?.cantidad) || 0;
        totalCantidad += cantidad;

        return {
            key: 'generar-' + entry.articuloId,
            className: 'border-b border-slate-200 dark:border-slate-700',
            content: [
                {
                    key: 'articulo',
                    content: (
                        <>
                            <span className={'font-medium text-slate-900 dark:text-slate-100'}>
                                {articulo?.nombre ?? 'Artículo #' + entry.articuloId}
                            </span>
                            <br/>
                            <span className={'text-sm text-slate-600 dark:text-slate-300'}>
                                {articulo?.codigo ?? '—'}
                            </span>
                        </>
                    ),
                    className: 'text-sm',
                },
                {
                    key: 'rubro',
                    content: (
                        <>
                            {articulo?.rubro?.nombre ?? '—'}
                            {' '}
                            <span className={'text-slate-500 dark:text-slate-400'}>
                                ({articulo?.marca?.nombre ?? '—'})
                            </span>
                        </>
                    ),
                    className: 'text-sm text-slate-800 dark:text-slate-100',
                },
                {
                    key: 'existencia',
                    content: processNumber(parseExistenciaCantidad(entry?.item?.existencias), 0, false, '#'),
                    className: 'text-sm text-right text-slate-800 dark:text-slate-100',
                },
                {
                    key: 'cantidad',
                    content: processNumber(cantidad, 0, false, '#'),
                    className: 'text-sm text-right font-semibold text-slate-900 dark:text-slate-50',
                },
                {
                    key: 'acciones',
                    content: disabled ? null : (
                        <DeleteIconButton
                            className={'m-0! inline-flex! px-1.5! py-0.5! text-xs!'}
                            onClick={() => onRemoveArticulo?.(entry.articuloId)}
                        />
                    ),
                    className: 'text-right',
                },
            ],
        };
    });

    if (rows.length > 0) {
        rows.push({
            key: 'generar-total',
            className: 'font-semibold border-t border-slate-300 dark:border-slate-600',
            content: [
                {key: 'articulo', content: 'Total', colSpan: 3, className: 'text-sm'},
                {
                    key: 'cantidad',
                    content: processNumber(totalCantidad, 0, false, '#'),
                    className: 'text-sm text-right',
                },
                {key: 'acciones', content: null, className: 'w-10'},
            ],
        });
    }

    return rows;
};

export const ArticulosAOrdenarGenerarProveedorCard = ({
    grupo,
    saveStatus = null,
    disabled = false,
    onChangeProveedor,
    onRemoveArticulo,
}) => {
    const tableData = useMemo(
        () => buildProveedorTableData(grupo?.items ?? [], {onRemoveArticulo, disabled}),
        [grupo?.items, onRemoveArticulo, disabled],
    );

    const isSaving = saveStatus?.status === GUARDAR_ORDEN_STATUS.SAVING;
    const isEditingDisabled = disabled || isSaving;
    const proveedorSinEmail = grupo?.proveedor != null && !grupo.proveedor.email;

    return (
        <ErrorBoundary>
            <AlternativeCard className={'mb-4' + (isSaving ? ' opacity-60 ' : '')}>
                <div className={'mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-700'}>
                    <div className={'min-w-0 flex-1'}>
                        <Label className={'mb-1! pl-0! text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400'}>
                            Proveedor
                        </Label>
                        <div className={'flex flex-wrap items-center gap-2'}>
                            <ArticulosAOrdenarProveedorSelect
                                value={grupo?.proveedor ?? null}
                                onChange={onChangeProveedor}
                                disabled={isEditingDisabled}
                                variant={'generar-header'}
                                placeholder={'Sin proveedor'}
                            />
                            {proveedorSinEmail ? (
                                <ChipRed className={'mt-0! shrink-0'}>
                                    Sin email configurado
                                </ChipRed>
                            ) : null}
                        </div>
                        <p className={'text-sm text-slate-600 dark:text-slate-300'}>
                            Total cantidad: {processNumber(grupo?.totalCantidad ?? 0, 0, false, '#')}
                        </p>
                    </div>
                </div>

                <Table
                    header={PROVEEDOR_HEADER}
                    data={tableData}
                    emptyText={'Sin artículos para este proveedor.'}
                />

                {saveStatus?.status === GUARDAR_ORDEN_STATUS.SAVING ? (
                    <div className={'mt-4 flex items-center justify-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-700'}>
                        <Loading />
                        <span className={'text-sm text-slate-600 dark:text-slate-300'}>
                            Guardando orden...
                        </span>
                    </div>
                ) : null}

                {saveStatus?.status === GUARDAR_ORDEN_STATUS.SUCCESS ? (
                    <AlertSuccess className={'mt-4 mb-0!'}>
                        {saveStatus.message}
                    </AlertSuccess>
                ) : null}

                {saveStatus?.status === GUARDAR_ORDEN_STATUS.ERROR ? (
                    <AlertDanger className={'mt-4 mb-0!'}>
                        {saveStatus.message}
                    </AlertDanger>
                ) : null}
            </AlternativeCard>
        </ErrorBoundary>
    );
};
