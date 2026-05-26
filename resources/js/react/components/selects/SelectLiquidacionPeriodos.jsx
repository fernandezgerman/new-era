import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {Select} from "@/components/Select.jsx";
import uuid from "react-uuid";
import {useLiquidacionPeriodos} from "@/dataHooks/useLiquidacionPeriodos.jsx";

const asPeriodosIdArray = (periodosId) => {
    if (Array.isArray(periodosId)) {
        return periodosId;
    }
    if (periodosId == null || periodosId === '') {
        return [];
    }
    return [periodosId];
};

export const SelectLiquidacionPeriodos = ({
    setPeriodos,
    periodos,
    errorMessage,
    className,
    multiple = true,
    label = null,
    placeHolder
}) => {
    const {data: liquidacionPeriodos, isLoading, isError, error} = useLiquidacionPeriodos();
    const [periodosId, setPeriodosId] = useState(multiple ? (periodos?.map(p => p.id) ?? []) : (periodos?.id ?? null));
    const [periodoSearch, setPeriodoSearch] = useState('');

    const periodosIdsKey = useMemo(() => {
        if (multiple) {
            return (periodos ?? [])
                .map((p) => parseInt(p?.id, 10))
                .filter((id) => Number.isFinite(id))
                .sort((a, b) => a - b)
                .join(',');
        }
        const rawId = periodos?.id;
        if (rawId == null || rawId === '') {
            return '';
        }
        const n = parseInt(rawId, 10);
        return Number.isFinite(n) ? String(n) : '';
    }, [multiple, periodos]);

    useEffect(() => {
        if (multiple) {
            const ids = periodosIdsKey
                ? periodosIdsKey.split(',').map((id) => parseInt(id, 10))
                : [];
            setPeriodosId((prev) => {
                const prevArr = asPeriodosIdArray(prev);
                const prevKey = [...prevArr].map(Number).sort((a, b) => a - b).join(',');
                const nextKey = [...ids].sort((a, b) => a - b).join(',');
                return prevKey === nextKey ? prevArr : ids;
            });
        } else {
            const nextId = periodosIdsKey ? parseInt(periodosIdsKey, 10) : null;
            setPeriodosId((prev) => (prev === nextId ? prev : nextId));
        }
    }, [multiple, periodosIdsKey]);

    useEffect(() => {
        if (isLoading) return;

        if (multiple) {
            const periodosIdArr = asPeriodosIdArray(periodosId);
            const selected = liquidacionPeriodos?.filter((p) =>
                periodosIdArr.includes(parseInt(p.id, 10)),
            ) ?? [];
            const selectedKey = selected
                .map((p) => parseInt(p.id, 10))
                .sort((a, b) => a - b)
                .join(',');
            if (periodosIdsKey !== selectedKey) {
                setPeriodos(selected);
            }
        } else {
            if (periodosId == null) {
                if (periodosIdsKey !== '') {
                    setPeriodos(null);
                }
                return;
            }
            const found = liquidacionPeriodos?.find(
                (p) => parseInt(p.id, 10) === parseInt(periodosId, 10),
            );
            if (!found) {
                return;
            }
            const foundKey = String(parseInt(found.id, 10));
            if (periodosIdsKey === foundKey) {
                return;
            }
            setPeriodos(found);
        }
    }, [periodosId, isLoading, liquidacionPeriodos, multiple, periodosIdsKey, setPeriodos]);

    const matchingPeriodos = useMemo(() => {
        const raw = (liquidacionPeriodos ?? []);
        const q = periodoSearch.trim();
        if (!q) {
            return [];
        }
        const lower = q.toLowerCase();
        return raw.filter((p) => {
            const desc = (p?.descripcion ?? '').toString().toLowerCase();
            const idStr = String(p?.id ?? '');
            return desc.includes(lower) || idStr.includes(q);
        });
    }, [liquidacionPeriodos, periodoSearch]);

    const nuevosPorSeleccionar = useMemo(() => {
        if (!multiple) {
            return [];
        }
        const selected = new Set(
            asPeriodosIdArray(periodosId).map((id) => parseInt(id, 10)),
        );
        return matchingPeriodos.filter((p) => !selected.has(parseInt(p.id, 10)));
    }, [multiple, matchingPeriodos, periodosId]);

    const onSeleccionarTodosCoincidencias = useCallback(() => {
        if (!multiple || nuevosPorSeleccionar.length === 0) {
            return;
        }
        const ids = new Set(
            asPeriodosIdArray(periodosId).map((id) => parseInt(id, 10)),
        );
        nuevosPorSeleccionar.forEach((p) => ids.add(parseInt(p.id, 10)));
        setPeriodosId(Array.from(ids));
    }, [multiple, nuevosPorSeleccionar, periodosId]);

    const selectOptions = useMemo(
        () => (liquidacionPeriodos?.map((periodo) => ({
            key: uuid(),
            value: periodo.id,
            label: periodo.descripcion ?? ('Periodo #' + periodo.id)
        })) ?? []),
        [liquidacionPeriodos],
    );

    return <ErrorBoundary>
        <div>
            <Select
                options={selectOptions}
                value={periodosId}
                className={(className ?? ' ') + ' mt-4 '}
                setValue={(val) => {
                    if (multiple) {
                        const list = Array.isArray(val) ? val : (val != null ? [val] : []);
                        setPeriodosId(list.map((v) => parseInt(v, 10)));
                    } else {
                        setPeriodosId(val !== null && val !== '' ? parseInt(val, 10) : null);
                    }
                }}
                placeholder={placeHolder ?? "Seleccione periodos"}
                label={label ?? 'Periodos'}
                errorMessage={errorMessage ?? (isError ? (error?.message ?? 'Error cargando periodos') : null)}
                multiple={multiple}
                allowRemove={multiple}
                isLoading={isLoading}
                searchResultLimit={-1}
                keepSearchTextOnMultiSelect={multiple}
                onSearchQueryChange={multiple ? setPeriodoSearch : undefined}
            />
            {multiple && periodoSearch.trim().length > 0 && nuevosPorSeleccionar.length > 0 && (
                <div className={'mt-2 pl-2'}>
                    <button
                        type={'button'}
                        className={
                            'cursor-pointer border-0 bg-transparent p-0 text-left text-sm underline '
                            + 'text-blue-700 decoration-blue-700/40 hover:text-blue-900 '
                            + 'dark:text-blue-300 dark:decoration-blue-300/40 dark:hover:text-blue-200'
                        }
                        onClick={onSeleccionarTodosCoincidencias}
                    >
                        {'Seleccionar todos los resultados filtrados ('}
                        {nuevosPorSeleccionar.length}
                        {')'}
                    </button>
                </div>
            )}
        </div>
    </ErrorBoundary>
}

