import React, {useEffect, useMemo, useRef} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Input} from '@/components/Input.jsx';
import {Checkbox} from '@/components/Checkbox.jsx';
import {DivCenterContentHyV} from '@/components/Containers/DivCenterContentHyV.jsx';
import useSystemTheme from '@/utils/useSystemTheme.jsx';
import {
    SORT_KEYS,
    getArticuloLabel,
    getRecordValues,
    getSortIndicator,
    isRecordChanged,
    isRecordNew,
} from './editarArticuloPromocionUtils.jsx';
import {processNumber} from "@/utils/numbers.jsx";

const changedRowClass = ' bg-blue-600! text-white! [&_input]:bg-blue-500! [&_input]:text-white! [&_input]:border-blue-400!';
const newRowClass = ' bg-green-600! text-white! [&_input]:bg-green-500! [&_input]:text-white! [&_input]:border-green-400!';

const stickyHeaderClass = ' sticky top-0 z-10 bg-white dark:bg-slate-900 ';

const EMPTY_EDITS = {};

const getRowClassName = (record, edits) => {
    if (isRecordNew(record)) {
        return newRowClass;
    }
    if (isRecordChanged(record, edits)) {
        return changedRowClass;
    }
    return '';
};

const getCellClassName = (destacarColumnasPares, darkMode, index, highlighted) => {
    if (highlighted) {
        return 'font-normal leading-normal text-sm ';
    }

    const zebraClass = destacarColumnasPares && (index % 2 !== 0)
        ? (darkMode ? ' bg-gray-800 ' : ' bg-gray-200 ')
        : '';

    return 'font-normal leading-normal text-sm  ' + zebraClass;
};

const PromocionArticuloFila = React.memo(({
    record,
    edits,
    inputResetKey,
    onFieldChange,
    destacarColumnasPares,
    darkMode,
    index,
    registerCantidadInputRef,
}) => {
    const values = getRecordValues(record, edits);
    const highlighted = isRecordNew(record) || isRecordChanged(record, edits);
    const rowClassName = getRowClassName(record, edits);

    return (
        <>
            <tr className={rowClassName}>
                <td rowSpan={2} className={getCellClassName(destacarColumnasPares, darkMode, index, highlighted)}>
                    {getArticuloLabel(record)}
                </td>
                <td className={getCellClassName(destacarColumnasPares, darkMode, index, highlighted)}>
                    <Input
                        key={`${record.id}-cantidad-${inputResetKey}`}
                        ref={(element) => registerCantidadInputRef(record.id, element)}
                        type={'cantidad'}
                        selectOnFocus={true}
                        value={values.cantidad ?? ''}
                        setValue={(nextValue) => onFieldChange(record.id, 'cantidad', nextValue)}
                        maxCharacters={4}
                        className={'mb-0! mr-2 w-20 '}
                        inputClassName={'h-8! text-sm!'}
                    />
                </td>
                <td className={getCellClassName(destacarColumnasPares, darkMode, index, highlighted)}>
                    <Input
                        key={`${record.id}-precio-${inputResetKey}`}
                        type={'pesos'}
                        selectOnFocus={true}
                        value={values.precio ?? ''}
                        maxCharacters={10}
                        setValue={(nextValue) => onFieldChange(record.id, 'precio', nextValue)}
                        className={'mb-0! mr-2 w-32 pt-1'}
                        inputClassName={'h-8! text-sm!'}
                    />

                </td>
                <td className={getCellClassName(destacarColumnasPares, darkMode, index, highlighted)}>
                    <Checkbox
                        value={Boolean(values.activo)}
                        onChange={(checked) => onFieldChange(record.id, 'activo', checked)}
                        className={'mb-0! pt-1'}
                        checkboxClassName={highlighted ? ' accent-white ' : ''}
                    />
                </td>
            </tr>
            <tr className={rowClassName}>
                <td colSpan={1} className={getCellClassName(destacarColumnasPares, darkMode, index, highlighted) + ' h-auto! p-0!'} ></td>
                <td colSpan={2} className={getCellClassName(destacarColumnasPares, darkMode, index, highlighted) + ' h-auto! p-0!'}>
                    <span className={'text-xxs'}>Costo: {processNumber(record.articulo?.compra_detalle?.costo_con_impuestos ?? record.articulo.costo,2, false, '$')}</span>
                </td>
            </tr>
        </>
    );
});

PromocionArticuloFila.displayName = 'PromocionArticuloFila';

export const EditarArticuloPromocionTabla = ({
    records = [],
    editsMap = {},
    inputResetTokens = {},
    sortConfig,
    onSortChange,
    onFieldChange,
    isLoading = false,
    destacarColumnasPares = true,
    focusCantidadRecordId = null,
    onFocusCantidadHandled = () => {},
}) => {
    const darkMode = useSystemTheme();
    const cantidadInputRefs = useRef({});

    const registerCantidadInputRef = useMemo(() => (recordId, element) => {
        if (element) {
            cantidadInputRefs.current[recordId] = element;
            return;
        }
        delete cantidadInputRefs.current[recordId];
    }, []);

    useEffect(() => {
        if (!focusCantidadRecordId) {
            return;
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                cantidadInputRefs.current[focusCantidadRecordId]?.focus();
                onFocusCantidadHandled();
            });
        });
    }, [focusCantidadRecordId, onFocusCantidadHandled]);

    const header = useMemo(() => [
        {
            key: SORT_KEYS.ARTICULO,
            label: <>Artículo{getSortIndicator(sortConfig, SORT_KEYS.ARTICULO)}</>,
            onClick: () => onSortChange(SORT_KEYS.ARTICULO),
        },
        {
            key: SORT_KEYS.CANTIDAD,
            label: <>Cantidad{getSortIndicator(sortConfig, SORT_KEYS.CANTIDAD)}</>,
            onClick: () => onSortChange(SORT_KEYS.CANTIDAD),
        },
        {
            key: SORT_KEYS.PRECIO,
            label: <>Precio{getSortIndicator(sortConfig, SORT_KEYS.PRECIO)}</>,
            onClick: () => onSortChange(SORT_KEYS.PRECIO),
        },
        {
            key: SORT_KEYS.ACTIVO,
            label: <>Activo{getSortIndicator(sortConfig, SORT_KEYS.ACTIVO)}</>,
            onClick: () => onSortChange(SORT_KEYS.ACTIVO),
        },
    ], [sortConfig, onSortChange]);

    if (!isLoading && records.length === 0) {
        return (
            <div className={'w-full p-6 text-slate-600 dark:text-slate-400 min-h-40 '}>
                No hay artículos activos en esta promoción.
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <table
                border={0}
                cellPadding={0}
                cellSpacing={0}
                className={'table w-full flex ' + (isLoading ? ' opacity-50 ' : '')}
            >
                <thead>
                    <tr>
                        {header.map((head) => (
                            <th
                                key={head.key}
                                onClick={head.onClick}
                                className={
                                    'font-bold uppercase text-slate-500 text-xxs dark:text-slate-500 '
                                    + 'cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-300 '
                                    + stickyHeaderClass
                                }
                            >
                                {head.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <PromocionArticuloFila
                            key={record.id}
                            record={record}
                            edits={editsMap[record.id] ?? EMPTY_EDITS}
                            inputResetKey={inputResetTokens[record.id] ?? 0}
                            onFieldChange={onFieldChange}
                            destacarColumnasPares={destacarColumnasPares}
                            darkMode={darkMode}
                            index={index}
                            registerCantidadInputRef={registerCantidadInputRef}
                        />
                    ))}
                </tbody>
            </table>
        </ErrorBoundary>
    );
};
