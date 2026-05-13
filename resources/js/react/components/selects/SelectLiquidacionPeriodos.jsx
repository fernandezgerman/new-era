import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {Select} from "@/components/Select.jsx";
import uuid from "react-uuid";
import {useLiquidacionPeriodos} from "@/dataHooks/useLiquidacionPeriodos.jsx";

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

    useEffect(() => {
        if (isLoading) return;

        if (multiple) {
            const selected = liquidacionPeriodos?.filter(p => periodosId?.includes(parseInt(p.id))) ?? [];
            setPeriodos(selected);
        } else {
            setPeriodos(
                periodosId !== null
                    ? liquidacionPeriodos?.find((p) => parseInt(p.id) === parseInt(periodosId))
                    : null
            );
        }
    }, [periodosId, isLoading, liquidacionPeriodos, multiple]);

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
        const selected = new Set((periodosId ?? []).map((id) => parseInt(id, 10)));
        return matchingPeriodos.filter((p) => !selected.has(parseInt(p.id, 10)));
    }, [matchingPeriodos, periodosId]);

    const onSeleccionarTodosCoincidencias = useCallback(() => {
        if (!multiple || nuevosPorSeleccionar.length === 0) {
            return;
        }
        const ids = new Set((periodosId ?? []).map((id) => parseInt(id, 10)));
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
                        setPeriodosId((val ?? []).map(v => parseInt(v)));
                    } else {
                        setPeriodosId(val !== null ? parseInt(val) : null);
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

